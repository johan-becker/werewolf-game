-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'RUNNING', 'FINISHED');

-- CreateEnum
CREATE TYPE "GamePhase" AS ENUM ('DAY', 'NIGHT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "games_won" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'WAITING',
    "max_players" INTEGER NOT NULL DEFAULT 12,
    "current_players" INTEGER NOT NULL DEFAULT 0,
    "game_settings" JSONB NOT NULL,
    "creator_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ,
    "finished_at" TIMESTAMPTZ,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "user_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "role" VARCHAR(50),
    "is_alive" BOOLEAN NOT NULL DEFAULT true,
    "is_host" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminated_at" TIMESTAMPTZ,

    CONSTRAINT "players_pkey" PRIMARY KEY ("user_id","game_id")
);

-- CreateTable
CREATE TABLE "game_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "game_id" UUID NOT NULL,
    "round_number" INTEGER NOT NULL,
    "phase" "GamePhase" NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "actor_id" UUID,
    "target_id" UUID,
    "details" JSONB,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "games_code_key" ON "games"("code");

-- CreateIndex
CREATE INDEX "games_code_idx" ON "games"("code");

-- CreateIndex
CREATE INDEX "games_status_idx" ON "games"("status");

-- CreateIndex
CREATE INDEX "games_creator_id_idx" ON "games"("creator_id");

-- CreateIndex
CREATE INDEX "games_created_at_idx" ON "games"("created_at");

-- CreateIndex
CREATE INDEX "players_game_id_idx" ON "players"("game_id");

-- CreateIndex
CREATE INDEX "players_user_id_idx" ON "players"("user_id");

-- CreateIndex
CREATE INDEX "players_role_idx" ON "players"("role");

-- CreateIndex
CREATE INDEX "game_logs_game_id_idx" ON "game_logs"("game_id");

-- CreateIndex
CREATE INDEX "game_logs_round_number_idx" ON "game_logs"("round_number");

-- CreateIndex
CREATE INDEX "game_logs_phase_idx" ON "game_logs"("phase");

-- CreateIndex
CREATE INDEX "game_logs_action_type_idx" ON "game_logs"("action_type");

-- CreateIndex
CREATE INDEX "game_logs_timestamp_idx" ON "game_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_logs" ADD CONSTRAINT "game_logs_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_logs" ADD CONSTRAINT "game_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
