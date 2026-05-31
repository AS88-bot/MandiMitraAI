# MandiMitra AI Security Specification

## Data Invariants
1. **User Profiles**: Only the authenticated user can create or update their own profile. email_verified must be true.
2. **Upload Results**: Results of pesticide/fertilizer scans must be tied to a valid user ID. Users can only read their own scan history.
3. **Farmer Queries**: Conversation history with the AI assistant is private to the user.
4. **Market Prices**: (Currently server-managed via API, but if moved to Firestore, it would be read-only for public/users).

## The Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing**: Attempt to create a `/users` document with a UID that doesn't match `request.auth.uid`.
2. **Scan Hijacking**: Attempt to read `/upload_results` where `userId` belongs to another farmer.
3. **Query Injection**: Attempt to write a query result to another user's subcollection.
4. **Invalid State**: Attempt to create an `UploadResult` without a mandatory `extractedText` field.
5. **PII Exposure**: Attempt to list all `/users` in a single query (blanket read).
6. **Ghost Field**: Attempt to update a user profile with a `role: 'admin'` field when not whitelisted.
7. **Timestamp Fraud**: Attempt to provide a client-side `createdAt` that is not `request.time`.
8. **Malicious ID**: Attempt to use a 1MB string as a document ID.
9. **Relational Poisoning**: Attempt to create a query result for a user ID that doesn't exist in the `/users` collection.
10. **Type Mismatch**: Sending a number for the `summary` field in `UploadResult`.
11. **Size Violation**: Sending a 500KB string for the `location` field.
12. **Unverified Auth**: Attempt to write data using a Google account with `email_verified: false`.

## Security Rules Plan
- Implement `isValidUser`, `isValidUploadResult`, `isValidQuery` helpers.
- Use `request.auth.token.email_verified == true`.
- Enforce `affectedKeys().hasOnly()` on updates.
- All timestamps bound to `request.time`.
