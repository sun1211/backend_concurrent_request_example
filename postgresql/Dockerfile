# Use an official PostgreSQL image as a base
FROM postgres:13

# Set environment variables
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# Copy the initialization script into the container's init directory
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432

# Start PostgreSQL
CMD ["postgres"]
