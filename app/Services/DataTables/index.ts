import { LucidModel } from "@ioc:Adonis/Lucid/Orm"
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class DatabaseServices {

  constructor(
    protected queryBuilder: ModelQueryBuilderContract<LucidModel, any>,
    protected params: {
      order: any,
      length: number,
      start: number,
      columns: any[],
      search: {
        value: string | null
      }
    }
  ) {}

  public async result() {

    const { order, length, start, columns, search } = this.params

    const query = this.queryBuilder.clone()

    if (search.value) {
      columns.forEach((column) => {
        if (column.searchable !== 'true') {
          return
        }

        query.orWhereRaw(`LOWER(${column.name}) like ?`, [`%${search.value?.toLowerCase()}%`])
      })
    }

    if (order) {
      query.orderBy(
        columns[order[0].column].data,
        order[0].dir
      )
    }

    const totalQuery = query.clone()

    const total = await totalQuery.count('*')

    const list = await query.offset(start).limit(length)

    return {
      recordsTotal: total,
      recordsFiltered: list.length,
      data: list
    }
  }

}