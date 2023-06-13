export const getCookie = () => {
  if (typeof document !== 'undefined') {
  //クッキーに値をセット
    console.log(document.cookie);
    const arr: {[key: string]: string} = {};
      // if (document.cookie) return undefined;
      if(document.cookie != ''){
      var tmp = document.cookie.split('; ');
      for(var i=0;i<tmp.length;i++){
        var data = tmp[i].split('=');
        arr[data[0]] = decodeURIComponent(data[1]);
      }
      const uid: string = arr['uid'];
      const client: string = arr['client'];
      const accessToken: string = arr['access-token'];
      const userId: string = arr['id'];
      const groupId: string = arr['group_id'];
      return {uid, client, accessToken, userId, groupId};
    }
  }
}

