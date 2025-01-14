import { Button, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { DataFetchingPlugin, FormView, useReactlit } from '@reactlit/core';
import { Inputs } from '@reactlit/radix';
import { TopRightLoader } from './components/loader';
import { ContactsMockService } from './mocks/contacts';

export default function ContactList() {
  return (
    <Theme
      style={{ position: 'relative' }}
      className="not-content"
      data-is-root-theme={false}
    >
      <ContactListApp />
    </Theme>
  );
}

// slow down the mock API to demo user experience with a slow API
const api = new ContactsMockService([], 1000);

const ContactListApp = () => {
  const Reactlit = useReactlit(DataFetchingPlugin);
  return (
    <Reactlit>
      {async (app) => {
        //
        // create a fetcher for the contacts with a cache key of ['contacts']
        const contactsFetcher = app.fetcher(['contacts'], () =>
          api.getContacts()
        );

        if (contactsFetcher.isFetching()) {
          app.display('loader', <TopRightLoader text="Loading Contacts..." />);
        }

        // get the current contacts synchronously, back off to empty list if null
        const contacts = contactsFetcher.get() ?? [];

        app.display(
          <Button
            onClick={async () => {
              // display another loader while the new contact is being added
              app.display(
                'loader',
                <TopRightLoader text="Adding new contact..." />
              );
              const newContact = await api.addContact();
              app.display('loader', undefined);
              // trigger a re-fetch of the contacts
              await contactsFetcher.refetch();
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
        app.display(
          <h3 style={{ paddingTop: '1rem' }}>Selected Contact Details</h3>
        );
        if (app.changed('selectedContact')) {
          app.set('updates', selectedContact);
        }
        const updates = app.view(
          'updates',
          FormView({
            name: Inputs.Text({ label: 'Name' }),
            email: Inputs.Text({ label: 'Email' }),
          })
        );
        app.display(
          <Button
            onClick={async () => {
              app.display(
                'loader',
                <TopRightLoader text="Updating contact..." />
              );
              const updatedContact = await api.updateContact(
                selectedContact.id,
                updates
              );
              // update the contacts cache directly to avoid needing to refetch
              // you can do this in-lieu of calling contactsFetcher.refetch() to avoid the
              // extra network request
              contactsFetcher.update((contacts) =>
                contacts.map((contact) =>
                  contact.id === updatedContact.id ? updatedContact : contact
                )
              );
              app.display('loader', undefined);
            }}
            // disable the button if the contacts are currently being fetched
            disabled={contactsFetcher.isFetching()}
          >
            Update
          </Button>
        );
      }}
    </Reactlit>
  );
};
