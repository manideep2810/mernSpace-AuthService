import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'Tenants' })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', { length: 255 })
    name: string

    @Column('varchar', { length: 255 })
    address: string

    @UpdateDateColumn()
    updatedAt: number

    @CreateDateColumn()
    createdAt: number
}
