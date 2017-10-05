DO $$

DECLARE
	iCount integer;
BEGIN

	SELECT COUNT(TABLE_NAME) INTO iCount FROM information_schema.tables WHERE TABLE_NAME = 'contacts';

	IF iCount = 0 THEN
		
		CREATE TABLE contacts (
			id INTEGER NOT NULL PRIMARY KEY,
			prefix VARCHAR(20),
			first_name VARCHAR(256),
			middle_name VARCHAR(256),
			last_name VARCHAR(256),

			organization VARCHAR(256),
			designation VARCHAR(256),
			street_address VARCHAR(256),
			extended_address VARCHAR(256),
			city VARCHAR(256),
			state VARCHAR(256),
			country VARCHAR(256),
			image_url VARCHAR(256),
			pincode INTEGER,
			updated_at TIMESTAMP,
			created_at TIMESTAMP
		);

		CREATE SEQUENCE contactsequence;
		
		CREATE OR REPLACE FUNCTION contactfunction()
		RETURNS "trigger" AS
		$CONTACT$
		BEGIN
			New.id = nextval('contactsequence');
			RETURN NEW;
		END;
		$CONTACT$
		LANGUAGE 'plpgsql' VOLATILE;

		CREATE TRIGGER contacttrigger
		BEFORE INSERT
		ON contacts
		FOR EACH ROW
		EXECUTE PROCEDURE contactfunction();
		
	END IF;

	SELECT COUNT(TABLE_NAME) INTO iCount FROM information_schema.tables WHERE TABLE_NAME = 'contactdetails';

	IF iCount = 0 THEN
	
		CREATE TABLE contactdetails (
			id INTEGER NOT NULL PRIMARY KEY,
			contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
			view_type varchar(256),
			type varchar(256),
			value varchar(256),
            updated_at TIMESTAMP,
            created_at TIMESTAMP
		);


		CREATE SEQUENCE contactdetailssequence;
		
		CREATE OR REPLACE FUNCTION contactdetailsfunction()
		RETURNS "trigger" AS
		$CONTACTDETAILS$
		BEGIN
			New.id = nextval('contactdetailssequence');
			RETURN NEW;
		END;
		$CONTACTDETAILS$
		LANGUAGE 'plpgsql' VOLATILE;

		CREATE TRIGGER contactdetailstigger
		BEFORE INSERT
		ON contactdetails
		FOR EACH ROW
		EXECUTE PROCEDURE contactdetailsfunction();
	END IF;
END;
$$;