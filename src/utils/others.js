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
      const res = await axios.get(`${apiUrl.API_URL}/picking?type=${type}&status=em_separacao&picker_user=${user}`, {withCredentials:true}); // Ajuste para sua rota real
      if (res.data.status && res.data.data.length > 0) {
        return res.data.data;
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
      const res = await axios.get(`${apiUrl.API_URL}/picking?type=${type}&status=aguardando_separacao&id_picking=${id_picking}`, {withCredentials:true}); // Ajuste para sua rota real
      if (res.data.status && res.data.data.length > 0) {
        return res.data.data;
      }else{
        return null
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
}

export async function UpdateOrders(status, data, id_picking) {
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    try {
        const orderBody = {status, data};
        const orderResponse = await axios.patch(`${apiUrl.API_URL}/update`, orderBody, {headers:{'Content-Type':'application/json',},withCredentials:true});
        if(orderResponse.data.status){
            const pikingResponse = await axios.patch(`${apiUrl.API_URL}/picking?status=${status}&id_picking=${id_picking}`); // Ajuste para sua rota real
            if (pikingResponse.data.status && pikingResponse.data.data.length > 0) {
              return pikingResponse.data.data;
            }
        }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    }
}