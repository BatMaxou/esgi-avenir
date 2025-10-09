import { Sequelize } from 'sequelize'

export const MariadbConnection = (mariadbDsn: string) => new Sequelize(mariadbDsn)
