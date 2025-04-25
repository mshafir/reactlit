// This is mocking a backend API for demo purposes

import { wait } from "../utils/wait";

export type Contact = {
	id: string;
	name: string;
	email: string;
};

// we add a delay to these to simulate a network request
export class ContactsMockService {
	constructor(
		private contacts: Contact[],
		private readonly delay: number = 0,
	) {}

	async getContacts() {
		await wait(this.delay);
		return this.contacts;
	}

	async addContact(contact?: Partial<Omit<Contact, "id">>) {
		await wait(this.delay);
		const newContact = {
			name: `New Contact ${this.contacts.length + 1}`,
			email: `contact${this.contacts.length + 1}@example.com`,
			...(contact ?? {}),
			id: `contact-${this.contacts.length + 1}`,
		};
		this.contacts = [...this.contacts, newContact];
		return newContact;
	}

	async updateContact(id: string, contact: Partial<Contact>) {
		await wait(this.delay);
		const index = this.contacts.findIndex((c) => c.id === id);
		if (index === -1) {
			throw new Error("Contact not found");
		}
		this.contacts = [
			...this.contacts.slice(0, index),
			{ ...this.contacts[index], ...contact },
			...this.contacts.slice(index + 1),
		];
		return this.contacts[index];
	}
}

export const ContactMockApi = new ContactsMockService([], 0);
