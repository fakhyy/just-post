# References

Read ./llms files for brief information about used technology

# Todos

- Separate reusable components
- Create docker-compose.yml and .env for database
- Add single user login using better auth
- create setting page with subpath like General (for changing password and session management) and Developer (for API key generation using better auth plugin - read pl
- Create dedicated schemas for posts and also for topics that will be used during post creation
- Keep the ui minimal and clean
- add feature flag for posts and only allow enabled when there status is set to published
- add featured badge next to status badge if it is, in the post list page
- user can create api for to access topics and post for external use (Read corresponding api key plugin for better auth in order to implement it).
- Make editor toolbar more accurate and optimized

# Search bar in post list

- user can filter post just typing `/date-range=10.10.2025-10.03.2026` for date filter just inside the searc input. Also add other date formats to filter it out.
- user can filter post just typing `/status=published` or `/status=draft` for filter post accordance to post status just inside the searc input.
