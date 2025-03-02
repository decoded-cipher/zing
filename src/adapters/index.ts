export const awsAdapter = (app: any) => app.export();
export const vercelAdapter = (app: any) => app.export();
export const cloudflareAdapter = (app: any) => ({
  async fetch(request: any) {
    return app.export()(request);
  }
});
