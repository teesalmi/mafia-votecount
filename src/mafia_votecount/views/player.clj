(ns mafia-votecount.views.player
  (:require [mafia-votecount.models :as models]))

(defn delete-player [id]
  (models/delete-player-by-id id))