(defproject mafia-votecount "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.6"]
                 [liberator "0.12.2"]
                 [clj-http "1.0.1"]
                 [enlive "1.1.5"]
                 [ring-server "0.3.1"]
                 [lobos "1.0.0-beta3"]
                 [korma "0.4.0"]
                 [com.h2database/h2 "1.4.184"]
                 [clojurewerkz/urly "1.0.0"]
                 [cheshire "5.4.0"]]
  :plugins [[lein-ring "0.8.12"]]
  :ring {:handler mafia-votecount.handler/app
         :init mafia-votecount.handler/init
         :destroy mafia-votecount.handler/destroy}
  :profiles
  {:uberjar {:aot :all}
   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false}}
   :dev
   {:dependencies [[ring-mock "0.1.5"] [ring/ring-devel "1.3.1"]]}})
