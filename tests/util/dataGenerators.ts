import { Page } from '@playwright/test'

export class DataGenerators {

    async generateRandomName(length: number): Promise<string> {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;

    }

    async generateRandomComment(length: number): Promise<string> {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;

    }
    
    async getRandomNumber(min: number, max: number): Promise<number> {
        return Math.floor(Math.random() * (max - min) + min)
      }


}