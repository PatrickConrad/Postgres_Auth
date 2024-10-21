import pool from "../config/db";

export const pgQuery = async (queryText: string, params?: string[]) => {
    try{
        if(params!=null){
            const t = await pool.query(queryText, params);
            pool.end();
            return t
        }
        else{
            const t = await pool.query(queryText);
            pool.end();
            return t
        }
 
    }
    catch(err:any){
        console.log({err})
        pool.end();
        return undefined
    }
}




