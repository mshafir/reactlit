import type { ReactlitContext } from '@reactlit/core';
import { Inputs } from '@reactlit/radix';
import { ContactMockApi as api } from '../mocks/contacts';
import { Button } from '@radix-ui/themes';

export async function ContactListApp(app: ReactlitContext) {
  const contacts = await api.getContacts();
  app.display(
    <Button
      onClick={async () => {
        const newContact = await api.addContact();
        app.set('selectedContact', newContact.id);
      }}
    >
      Add Contact
    </Button>
  );
  const selectedContact = app.view(
    'selectedContact',
    Inputs.Table(contacts, {
      getRowId: (contact) => contact.id,
      columns: ['name', 'email'],
    })
  );
  if (!selectedContact) return;
  app.display(<h3 style={{ paddingTop: '1rem' }}>Selected Contact Details</h3>);
  if (app.changed('selectedContact')) {
    app.set('name', selectedContact.name);
    app.set('email', selectedContact.email);
  }
  const name = app.view('name', Inputs.Text({ label: 'Name' }));
  const email = app.view('email', Inputs.Text({ label: 'Email' }));
  app.display(
    <Button
      onClick={async () => {
        await api.updateContact(selectedContact.id, { name, email });
        app.trigger();
      }}
    >
      Update
    </Button>
  );
}
