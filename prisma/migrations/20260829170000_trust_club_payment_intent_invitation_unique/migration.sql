BEGIN;

-- TRUST CLUB V1
-- Preserve historical Payment Intent records.
--
-- Historical forensic evidence established one duplicate invitation:
--   confirmed intent:
--     cmtd72ss20000fgn9jxbefeyq
--   unsettled duplicate:
--     cmtd7bzs70000mwn9mhkynx2c
--
-- The unsettled duplicate is retained as historical evidence and moved
-- to the terminal CANCELLED state only if its certified preconditions
-- still hold.

DO $$
DECLARE
  target_count integer;
  settlement_count integer;
BEGIN
  SELECT COUNT(*)
  INTO target_count
  FROM "trust_club_payment_intents"
  WHERE "paymentIntentId" = 'cmtd7bzs70000mwn9mhkynx2c'
    AND "invitationId" = 'cmtd6uwdc0000d8n9t00d3hj4'
    AND "status" = 'AWAITING_SETTLEMENT';

  IF target_count <> 1 THEN
    RAISE EXCEPTION
      'Historical duplicate remediation precondition failed: expected one AWAITING_SETTLEMENT target';
  END IF;

  SELECT COUNT(*)
  INTO settlement_count
  FROM "trust_club_settlement_reflections"
  WHERE "paymentIntentId" = 'cmtd7bzs70000mwn9mhkynx2c';

  IF settlement_count <> 0 THEN
    RAISE EXCEPTION
      'Historical duplicate remediation blocked: target Payment Intent has settlement history';
  END IF;

  UPDATE "trust_club_payment_intents"
  SET
    "status" = 'CANCELLED',
    "cancelledAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE "paymentIntentId" = 'cmtd7bzs70000mwn9mhkynx2c'
    AND "invitationId" = 'cmtd6uwdc0000d8n9t00d3hj4'
    AND "status" = 'AWAITING_SETTLEMENT';

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Historical duplicate remediation update failed';
  END IF;
END
$$;

-- Only one non-terminal Payment Intent may exist for an invitation.
-- Historical CANCELLED and EXPIRED attempts remain preserved.
CREATE UNIQUE INDEX "trust_club_payment_intents_active_invitationId_key"
ON "trust_club_payment_intents"("invitationId")
WHERE "status" NOT IN ('CANCELLED', 'EXPIRED');

COMMIT;
