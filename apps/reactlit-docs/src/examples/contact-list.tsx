import { Theme } from "@radix-ui/themes";
import { Reactlit } from "@reactlit/core";
import "@radix-ui/themes/styles.css";
import { ContactListApp } from "./apps/contact-list";

export default function ContactList() {
	return (
		<Theme className="not-content" data-is-root-theme={false}>
			<Reactlit>{ContactListApp}</Reactlit>
		</Theme>
	);
}
