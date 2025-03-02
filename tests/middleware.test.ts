import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import logger from '../src/middleware/logger';
import { Request, EnhancedResponse, NextFunction, MiddlewareFunction } from '../src/types';

describe('Middleware System', () => {
  // Setup for console.log spying
  let consoleLogSpy: any;

  beforeEach(() => {
    // Mock console.log to track calls
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up mocks
    consoleLogSpy.mockRestore();
  });

  describe('Logger Middleware', () => {
    test('should log the request method and URL', async () => {
      // Arrange
      const req = {
        method: 'GET',
        url: '/test-route'
      } as Request;
      
      const res = {} as EnhancedResponse;
      const next = jest.fn().mockImplementation(() => Promise.resolve()) as unknown as NextFunction;

      // Act
      await logger(req, res, next);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('GET /test-route');
      expect(next).toHaveBeenCalled();
    });

    test('should log correctly for different HTTP methods and routes', async () => {
      // Test cases for different HTTP methods and routes
      const testCases = [
        { method: 'POST', url: '/users' },
        { method: 'PUT', url: '/users/123' },
        { method: 'DELETE', url: '/comments/456' },
        { method: 'PATCH', url: '/posts/789' }
      ];

      for (const testCase of testCases) {
        // Arrange
        const req = {
          method: testCase.method,
          url: testCase.url
        } as Request;
        
        const res = {} as EnhancedResponse;
        const next = jest.fn().mockImplementation(() => Promise.resolve()) as unknown as NextFunction;

        // Act
        await logger(req, res, next);

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(`${testCase.method} ${testCase.url}`);
        expect(next).toHaveBeenCalled();
        
        // Reset mocks for next iteration
        consoleLogSpy.mockClear();
        jest.clearAllMocks();
      }
    });
  });

  describe('Middleware Chaining', () => {
    test('should execute middleware in the correct order', async () => {
      // Arrange
      const executionOrder: string[] = [];
      
      // Create mock middleware functions
      const middleware1: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware1');
        await next();
        executionOrder.push('middleware1-after');
      };
      
      const middleware2: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware2');
        await next();
        executionOrder.push('middleware2-after');
      };
      
      const middleware3: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware3');
        await next();
        executionOrder.push('middleware3-after');
      };

      const req = {} as Request;
      const res = {} as EnhancedResponse;
      
      // Chain middleware manually
      const finalHandler = jest.fn().mockImplementation(() => {
        executionOrder.push('final-handler');
        return Promise.resolve();
      }) as unknown as NextFunction;

      // Act - execute the middleware chain
      await middleware1(req, res, async () => {
        await middleware2(req, res, async () => {
          await middleware3(req, res, finalHandler);
        });
      });

      // Assert
      expect(executionOrder).toEqual([
        'middleware1',
        'middleware2',
        'middleware3',
        'final-handler',
        'middleware3-after',
        'middleware2-after',
        'middleware1-after'
      ]);
      expect(finalHandler).toHaveBeenCalled();
    });

    test('should stop middleware chain execution when next is not called', async () => {
      // Arrange
      const executionOrder: string[] = [];
      
      // Create middleware that doesn't call next
      const middleware1: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware1');
        await next();
      };
      
      const middleware2: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware2');
        // Intentionally not calling next()
      };
      
      const middleware3: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware3');
        await next();
      };

      const req = {} as Request;
      const res = {} as EnhancedResponse;
      const finalHandler = jest.fn() as unknown as NextFunction;

      // Act - execute the middleware chain
      await middleware1(req, res, async () => {
        await middleware2(req, res, async () => {
          await middleware3(req, res, finalHandler);
        });
      });

      // Assert
      expect(executionOrder).toEqual(['middleware1', 'middleware2']);
      expect(executionOrder).not.toContain('middleware3');
      expect(finalHandler).not.toHaveBeenCalled();
    });

    test('should handle errors in middleware', async () => {
      // Arrange
      const executionOrder: string[] = [];
      
      // Create middleware that throws an error
      const middleware1: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware1');
        await next();
        executionOrder.push('middleware1-after');
      };
      
      const middleware2: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware2');
        throw new Error('Test error');
      };
      
      const middleware3: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('middleware3');
        await next();
      };

      const req = {} as Request;
      const res = {} as EnhancedResponse;
      const finalHandler = jest.fn() as unknown as NextFunction;
      const errorHandler = jest.fn();

      // Act - execute the middleware chain with try/catch
      try {
        await middleware1(req, res, async () => {
          await middleware2(req, res, async () => {
            await middleware3(req, res, finalHandler);
          });
        });
      } catch (error) {
        errorHandler(error);
      }

      // Assert
      expect(executionOrder).toEqual(['middleware1', 'middleware2']);
      expect(executionOrder).not.toContain('middleware3');
      expect(executionOrder).not.toContain('middleware1-after');
      expect(finalHandler).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
      const error = errorHandler.mock.calls[0][0] as Error;
      expect(error.message).toBe('Test error');
    });

    test('should integrate logger middleware with other middleware', async () => {
      // Arrange
      const executionOrder: string[] = [];
      
      // Create a mock middleware
      const mockMiddleware: MiddlewareFunction = async (req, res, next) => {
        executionOrder.push('mockMiddleware');
        await next();
        executionOrder.push('mockMiddleware-after');
      };

      const req = {
        method: 'GET',
        url: '/test-integration'
      } as Request;
      
      const res = {} as EnhancedResponse;
      const finalHandler = jest.fn().mockImplementation(() => {
        executionOrder.push('final-handler');
        return Promise.resolve();
      }) as unknown as NextFunction;

      // Act - execute the middleware chain with logger
      await logger(req, res, async () => {
        await mockMiddleware(req, res, finalHandler);
      });

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith('GET /test-integration');
      expect(executionOrder).toEqual([
        'mockMiddleware',
        'final-handler',
        'mockMiddleware-after'
      ]);
      expect(finalHandler).toHaveBeenCalled();
    });
  });
});

