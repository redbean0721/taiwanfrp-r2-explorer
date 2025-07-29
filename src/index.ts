import { R2Explorer } from "r2-explorer";

type Env = {
  TAIWANFRP: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 從 KV 讀取 JSON 格式的帳號密碼陣列
    const authRaw = await env.TAIWANFRP.get("r2_auth");
    let basicAuth = [];

    if (authRaw) {
      try {
        basicAuth = JSON.parse(authRaw);
      } catch (e) {
        return new Response("Invalid auth config in KV", { status: 500 });
      }
    }

    // 用動態帳密建立 R2Explorer middleware
    const handler = R2Explorer({
      readonly: false,
      basicAuth
    });

    return handler.fetch(request, env, ctx);
  }
};