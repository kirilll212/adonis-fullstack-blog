import { LucidModel, BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';

export default class DatabaseServices<T extends LucidModel> {

  constructor(
    protected queryBuilder: ModelQueryBuilderContract<T, any>,
    protected params: {
      draw: number;
      order: any;
      length: number;
      start: number;
      columns: any[];
      search: {
        value: string | null;
      };
    }
  ) {}

  public async result() {
    const {
      draw,
      order = null,
      length = 10,
      start = 1,
      columns = [],
      search = { value: null }
    } = this.params;

    const query = this.queryBuilder.clone();

    if (search.value) {
      columns.forEach((column) => {
        if (column.searchable !== 'true') {
          return;
        }

        query.orWhereRaw(`LOWER((${column.name})::text) like ?`, [`%${search.value?.trim().toLowerCase()}%`]);
      });
    }

    if (order) {
      query.orderBy(
        columns[order[0].column].data,
        order[0].dir
      );
    }

    const totalQuery = query.clone();

    const total = await totalQuery.count('*');

    const list = await query.offset(start).limit(length);

    return {
      draw: draw,
      recordsTotal: total as unknown as number,
      recordsFiltered: total as unknown as number,
      data: list.map((item) => (item instanceof BaseModel && typeof item.toJSON === 'function' ? item.toJSON() : item))
    };
    
  }
}
