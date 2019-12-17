import {
  PoolConnection,
  OkPacket,
  RowDataPacket
} from 'mysql2/promise';

export class DatabaseConnection {
  protected conn: PoolConnection;

  constructor(conn: PoolConnection) {
    this.conn = conn;
  }

  async select<T = RowDataPacket>(sql, params?): Promise<T[] | null> {
    const [ rows ] = await this.conn.query(sql, params);
    return rows as T[];
  }

  async query(sql, params?): Promise<OkPacket> {
    const [ row ] = await this.conn.query(sql, params);
    return row as OkPacket;
  }

  async first<T = RowDataPacket>(sql, params?): Promise<T | null> {
    const rows = await this.select(sql, params);
    if (rows.length === 0) return null;
    else return rows[0] as T;
  }
}