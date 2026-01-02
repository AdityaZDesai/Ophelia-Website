import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { appendFileSync } from "fs";

const logDebug = (data: Record<string, unknown>) => {
  try {
    appendFileSync('/Users/adityadesai/Desktop/projects/gf_frontend/.cursor/debug.log', JSON.stringify({...data, timestamp: Date.now(), sessionId: 'debug-session'}) + '\n');
  } catch {}
};

const handler = toNextJsHandler(auth.handler);

// #region agent log
export async function GET(request: NextRequest) {
  logDebug({location:'auth/route.ts:GET',message:'Auth GET request received',data:{url:request.url,method:'GET'},hypothesisId:'C'});
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  const url = request.url;
  logDebug({location:'auth/route.ts:POST',message:'Auth POST request received',data:{url,method:'POST'},hypothesisId:'B'});
  try {
    const response = await handler.POST(request);
    logDebug({location:'auth/route.ts:POST:response',message:'Auth POST response',data:{status:response.status},hypothesisId:'B'});
    return response;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logDebug({location:'auth/route.ts:POST:error',message:'Auth POST error',data:{error:errorMsg},hypothesisId:'B'});
    throw err;
  }
}
// #endregion

