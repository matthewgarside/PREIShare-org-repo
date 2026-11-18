export type MemberContact = {
  displayName: string;
  email: string;
  phone: string;
};

export type PropertyListing = {
  id: string;
  title: string;
  summary: string;
  member: MemberContact;
};

export type PublicSharePreview = {
  title: string;
  summary: string;
  memberEmail: string;
  memberPhone: string;
};

export const propertyListing: PropertyListing = {
  id: "listing-example-101",
  title: "Fictional Maple Street Home",
  summary: "A fictional two-bedroom property for review practice.",
  member: {
    displayName: "Example Member",
    email: "example@example.com",
    phone: "202-555-0142",
  },
};

export function getPublicSharePreview(
  listingId: string,
): PublicSharePreview | undefined {
  if (propertyListing.id !== listingId) {
    return undefined;
  }

  return {
    title: propertyListing.title,
    summary: propertyListing.summary,
    memberEmail: propertyListing.member.email,
    memberPhone: propertyListing.member.phone,
  };
}
