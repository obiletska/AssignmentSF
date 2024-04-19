import { Page } from '@playwright/test'

export class ContactUsForm {

    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }
    async submitFormWithAllFieldsFilled(firstName: string, lastName: string, email: string, comment: string){
        await this.page.getByPlaceholder('First Name').fill(firstName)
        await this.page.getByPlaceholder('Last Name').fill(lastName)
        await this.page.getByPlaceholder('Email Address').fill(email)
        await this.page.getByPlaceholder('Comments').fill(comment)
        await this.page.getByRole('button', {name: 'SUBMIT'}).click()
}

    async fillFormWithAllFields(firstName: string, lastName: string, email: string, comment: string){
        await this.page.getByPlaceholder('First Name').fill(firstName)
        await this.page.getByPlaceholder('Last Name').fill(lastName)
        await this.page.getByPlaceholder('Email Address').fill(email)
        await this.page.getByPlaceholder('Comments').fill(comment)
}

}