import { Button, Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import {
  SingleTableInputViewComponent,
  TextInputComponent,
} from '@reactlit/radix';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { TopRightLoader } from './components/loader';
import { ContactsMockService, type Contact } from './mocks/contacts';

const api = new ContactsMockService([], 1000);

const queryClient = new QueryClient();

export default function ContactList() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme
        style={{
          position: 'relative',
        }}
        className="not-content"
        data-is-root-theme={false}
      >
        <ContactListApp />
      </Theme>
    </QueryClientProvider>
  );
}

function ContactListApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const client = useQueryClient();
  const { data: contacts, isFetching } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.getContacts(),
  });
  const { mutateAsync: addContact, isPending: addingContact } = useMutation({
    mutationFn: async () => await api.addContact(),
    onSuccess: async (newContact) => {
      await client.invalidateQueries({ queryKey: ['contacts'] });
      setSelectedContactId(newContact.id);
    },
  });
  const { mutateAsync: updateContact, isPending: updatingContact } =
    useMutation({
      mutationFn: (contact: Contact) => api.updateContact(contact.id, contact),
      onSuccess: (data) => {
        client.setQueryData(['contacts'], (contacts: Contact[]) =>
          contacts.map((c) => (c.id === data.id ? data : c))
        );
      },
    });
  const [selectedContactId, setSelectedContactId] = useState<
    string | undefined
  >();
  const selectedContact = useMemo(
    () => contacts?.find((c) => c.id === selectedContactId),
    [contacts, selectedContactId]
  );
  useEffect(() => {
    if (selectedContact) {
      setName(selectedContact.name);
      setEmail(selectedContact.email);
    }
  }, [selectedContact, setName, setEmail]);
  return (
    <div>
      {isFetching && <TopRightLoader text="Loading Contacts..." />}
      {!isFetching && addingContact && (
        <TopRightLoader text="Adding new contact..." />
      )}
      {!isFetching && updatingContact && (
        <TopRightLoader text="Updating contact..." />
      )}
      <Button onClick={() => addContact()}>Add Contact</Button>
      <SingleTableInputViewComponent
        stateKey="selectedContact"
        data={contacts ?? []}
        columns={['name', 'email']}
        value={selectedContactId}
        setValue={(id) => setSelectedContactId(id)}
        getRowId={(c) => c.id}
        display={() => {}}
        view={() => undefined as any}
      />
      {selectedContact && (
        <>
          <h3 style={{ paddingTop: '1rem' }}>Selected Contact Details</h3>
          <TextInputComponent
            stateKey="name"
            label="Name"
            value={name}
            setValue={setName}
            display={() => {}}
            view={() => undefined as any}
          />
          <TextInputComponent
            stateKey="email"
            label="Email"
            value={email}
            setValue={setEmail}
            display={() => {}}
            view={() => undefined as any}
          />
          <Button
            disabled={isFetching}
            onClick={() =>
              updateContact({ name, email, id: selectedContact.id })
            }
          >
            Update
          </Button>
        </>
      )}
    </div>
  );
}
