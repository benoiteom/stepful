## Description

This is a coaching website where coaches and students have an account, and can book calls with each other. The coaches can view their time slots, add a new time slot, and view their calls. Students can view available time slots for all coaches, book one of the time slots, and view their calls. Note the calls page is very basic for now.

To use, select a student or coach from the dropdown on the welcome page and login, you can navigate using the navbar from there.


## Database

```
users
  id
  name
  phone
  email

time_slots
  id
  coach_id
  start
  end
  is_booked

calls
  id
  time_slot_id
  coach_id
  student_id
  satisfaction
  notes
```


## Clone and run locally

1. First close this repo

2. Use `cd` to change into the app's directory

   ```bash
   cd stepful
   ```

3. Set environment variables for Supabase in `.env.local`

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. Install dependencies:

   ```bash
   npm install
   ```

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The website should now be running on [localhost:3000](http://localhost:3000/).


> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.


Happy coding!
