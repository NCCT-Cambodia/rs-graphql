import { Pool, RowDataPacket, OkPacket } from "mysql2/promise";
import { DatabaseConnection } from "./DatabaseConnection";

export class DatabasePool {
  pool: Pool;
  
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async select<T = RowDataPacket>(sql, params?): Promise<T[] | null> {
    const [ rows ] = await this.pool.query(sql, params);
    return rows as T[];
  }

  async query(sql, params?): Promise<OkPacket> {
    const [ row ] = await this.pool.query(sql, params);
    return row as OkPacket;
  }

  async first<T = RowDataPacket>(sql, params?): Promise<T | null> {
    const rows = await this.select(sql, params);
    if (rows.length === 0) return null;
    else return rows[0] as T;
  }

  async transaction(transactionCallBack: ((conn: DatabaseConnection) => Promise<void>)) {
    const conn = await this.pool.getConnection();
    let success = false;
    
    try {
      await conn.beginTransaction();

      const dbConnection = new DatabaseConnection(conn);
      await transactionCallBack(dbConnection);

      await conn.commit();
      success = true;
    } catch(e) {
      console.log(e.message);
      await conn.rollback();
    }

    conn.release();

    return success;
  }

  buildAddFields(data: { [key: string]: any }, mapParams): [string, any[]] {
    const keys = Object.keys(mapParams);
    const values = [];
    const fields = [];
  
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (data[key] !== null && data[key] !== undefined) {
        fields.push(mapParams[key]);
        values.push(data[key]);
      }
    }
  
    return [
      "(" + fields.join(',') + ") VALUES(" + Array(fields.length).fill("?") + ")",
      values
    ];
  }

  buildUpdateFields(data: { [key: string]: any }, mapParams): [string, {}] {
    const keys = Object.keys(mapParams);
    const values = {};
    const fields = [];
  
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (data[key] !== null && data[key] !== undefined) {
        fields.push(mapParams[key]);
        values[mapParams[key].fieldName.replace(/`/g, '')] = data[key];
      }
    }
  
    return [
      fields.map(x => `${x.fieldName} = ${x.param}`).join(','),
      values
    ];
  }

  buildConditionFields(data: { [key: string]: any }, mapParams): [string, any[]] {
    if(!data) {
      return ["", []];
    }

    const keys = Object.keys(mapParams);
    const values = [];
    const fields = [];
    
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (data[key] !== null && data[key] !== undefined) {
        fields.push(mapParams[key]);
        if(mapParams[key].isCustomCondition === undefined || !mapParams[key].isCustomCondition) {
          values.push(data[key]);
        }
      }
    }

    const conditions = fields.map((x) => {
      if(x.isCustomCondition !== undefined && x.isCustomCondition) {
        return `${x.customCondition}`;
      } else {
        return `${x.logicalOperator} ${x.fieldName} ${x.operator} ?`;
      }
    }).join(' ');

    return [conditions, values];
  }
}