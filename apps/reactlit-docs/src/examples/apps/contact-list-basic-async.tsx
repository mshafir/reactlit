import { Button } from "@radix-ui/themes";
import { type ReactlitContext } from "@reactlit/core";
import { Inputs, Label } from "@reactlit/radix";
import { TopRightLoader } from "../components/loader";
import { ContactsMockService } from "../mocks/contacts";

// add a delay to the mock API
const api = new ContactsMockService([], 500);

export async function ContactListApp(app: ReactlitContext) {
	// wrap a loader around the contacts fetch
	app.display("loading-items", <TopRightLoader text="Loading Contacts..." />);
	const contacts = await api.getContacts();
	app.display("loading-items", undefined);
	app.display(
		<Button
			onClick={async () => {
				const newContact = await api.addContact();
				app.set("selectedContact", newContact.id);
			}}
		>
			Add Contact
		</Button>,
	);
	const selectedContact = app.view(
		"selectedContact",
		Inputs.Table(contacts, {
			getRowId: (contact) => contact.id,
			columns: ["name", "email"],
		}),
	);
	if (!selectedContact) return;
	app.display(<h3 style={{ paddingTop: "1rem" }}>Selected Contact Details</h3>);
	if (app.changed("selectedContact")) {
		app.set("name", selectedContact.name);
		app.set("email", selectedContact.email);
	}
	const updates = {
		name: app.view("name", Label("Name"), Inputs.Text()),
		email: app.view("email", Label("Email"), Inputs.Text()),
	};
	// if you wish, you can use an AsyncButton view for a button that
	// has a loading state during async operations
	app.view(
		"updating",
		Inputs.AsyncButton(
			async () => {
				await api.updateContact(selectedContact.id, updates);
				app.trigger();
			},
			{
				content: "Update",
			},
		),
	);
}
