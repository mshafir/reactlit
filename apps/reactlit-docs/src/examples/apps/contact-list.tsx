import { Button } from '@radix-ui/themes';
import { type ReactlitContext } from '@reactlit/core';
import { Inputs, Label } from '@reactlit/radix';
import { ContactMockApi as api } from '../mocks/contacts';

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
  // the built-in FormView allows you to group inputs together
  const updates = {
    name: app.view('name', Label('Name'), Inputs.Text()),
    email: app.view('email', Label('Email'), Inputs.Text()),
  };
  app.display(
    <Button
      onClick={async () => {
        await api.updateContact(selectedContact.id, updates);
        app.trigger();
      }}
    >
      Update
    </Button>
  );
}
