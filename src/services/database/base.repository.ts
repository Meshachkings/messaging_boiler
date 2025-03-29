import { Model, Document, FilterQuery } from 'mongoose';
import { DatabaseService } from './database.service';

export abstract class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(modelName: string) {
        try {
            this.model = DatabaseService.getInstance().getModel<T>(modelName);
        } catch (error) {
            console.error(`Failed to get model ${modelName}:`, error);
            throw error;
        }
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findOne(conditions: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(conditions);
    }

    async find(conditions: FilterQuery<T>): Promise<T[]> {
        return this.model.find(conditions);
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }
} 