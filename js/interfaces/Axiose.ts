export namespace axiose {
  export type RequestConfig = {
    headers?: HeadersInit;
  }
  export async function get<T = any>(url: string, config?: RequestConfig): Promise<{ data: T}> {
    const d = await fetch(url, { headers: config?.headers as HeadersInit});
    const t = await d.text();
    let s;
    try {
      s = JSON.parse(t);
    } catch {
      s = t;
    }
    if (d.status >= 400) {
      throw {
        response: {
          data: s
        }
      }
    }
    return { data: s };
  };
  export async function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<{ data: T }> {
    /*let isJSON = true;
    try {
      JSON.parse(data);
    } catch {
      isJSON = false;
    }
    isJSON && Object.assign(config?.headers as HeadersInit, { "Content-Type": "application/json" });*/
    const d = await fetch(url, { method: "POST", body: JSON.stringify(data), headers: config?.headers as HeadersInit});
    const t = await d.text();
    let s;
    try {
      s = JSON.parse(t);
    } catch {
      s = t;
    }
    if (d.status >= 400) {
      throw {
        response: {
          data: s
        }
      }
    }
    return { data: s };
  }
}