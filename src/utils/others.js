import axios from "axios";

export async function LoadPendingTasks(type) {
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    try {
      const res = await axios.get(`${apiUrl.API_URL}/picking?type=${type}`, {withCredentials:true}); // Ajuste para sua rota real
      if (res.data.status && res.data.data.length > 0) {
        return res.data.data;
      }else{
        return null
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
}

export async function LoadCurrentTask(type, user) {
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    try {
      //console.log(`${apiUrl.API_URL}/picking?type=${type}&status=em_separacao&picker_user=${user}`)
      const res = (await axios.get(`${apiUrl.API_URL}/picking?type=${type}&status=em_separacao&picker_user=${user}`, {withCredentials:true})).data; // Ajuste para sua rota real
      //console.log(res)
      if (res.status) {
        return res;
      }else{
        return null
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
}

export async function LoadTask(type, id_picking) {
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    try {
      const res = (await axios.get(`${apiUrl.API_URL}/picking?type=${type}&id_picking=${id_picking}`, {withCredentials:true})).data; // Ajuste para sua rota real
      //console.log(res)
      if (res.status && res.data.length > 0) {
        return res;
      }else{
        return null
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      return {status:false, data:null, message:err.message};
    }
}

export async function UpdateOrders(status, data, id_picking) {
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    try {
        const orderBody = {status: status == 'cancelado' ? 'aguardando_separacao' : status, data};
        const orderResponse = (await axios.patch(`${apiUrl.API_URL}/update`, orderBody, {headers:{'Content-Type':'application/json',},withCredentials:true})).data;
        console.log(orderResponse)
        if(orderResponse.status){
            const pickingResponse = (await axios.patch(`${apiUrl.API_URL}/picking?status=${status}&id_picking=${id_picking}`,{}, {withCredentials:true})).data;
            //console.log(pickingResponse)
            console.log({status: orderResponse.status? pickingResponse.status : orderResponse.status, orders:orderResponse.data, picking:pickingResponse.data})
            if (pickingResponse.status) {
              return {status: orderResponse.status? pickingResponse.status : orderResponse.status, orders:orderResponse.data, picking:pickingResponse.data};
            }else{
              throw new Error(pickingResponse.message);
            }
        }else{
          throw new Error(orderResponse.message);
        }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      return {status:false, message:"Erro ao buscar tarefas:"+err.message}
    }
}


export async function LoadBay(cabinet_code, bay_code) {
  const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
  try {
    const res = (await axios.get(`${apiUrl.API_URL}/presend?cabinet_code=${cabinet_code}&bay_code=${bay_code}`, {withCredentials:true})).data; // Ajuste para sua rota real
    //console.log(res)
    if (res.status) {
      return res.data;
    }else{
      return null
    }
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
  }
}

export async function LoadBayByOrder(external_id) {
  const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
  try {
    const res = (await axios.get(`${apiUrl.API_URL}/presend?external_id=${external_id}`, {withCredentials:true})).data; // Ajuste para sua rota real
    //console.log(res)
    if (res.status) {
      return res.data;
    }else{
      return null
    }
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
  }
}

export async function UpdateBay(cabinet_code, bay_code, external_id) {
  const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
  try {
    const res = (await axios.patch(`${apiUrl.API_URL}/presend`,{cabinet_code, bay_code, external_id},  {headers:{'Content-Type':'application/json',},withCredentials:true})).data; // Ajuste para sua rota real
    //console.log(res)
    if (res.status) {
      return res;
    }else{
      return null
    }
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
  }
}