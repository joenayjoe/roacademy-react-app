export const parseQueryParams = (query: any) => {
    query = query.substring(1);
    let params = query.split("&");
    let paramMap: any = {};
    for (let i of params) {
      let j = i.split("=");
      let k: string = j[0];
      let v: any = j[1];
      paramMap[k] = v;
    }
    return paramMap;
  };