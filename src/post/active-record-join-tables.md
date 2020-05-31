---
title: Active Record Join Tables
date: 2014-08-04
tags: post
layout: layouts/post.liquid
---

From “Plain Vanilla” to Many-to-Many Self Join

_(For a summary, visit my [SO post](http://stackoverflow.com/questions/25493368/many-to-many-self-join-in-rails/25493403#25493403).)_

### Plain Vanilla Join Table

Ordinarily, a join table works to account for a many-to-many relationship between two otherwise independent models. As an example, a **Player** may be a member of many :teams over the course of a career. Conversely, each **Team** may have many **:**players. Each **Contract** joins a **Player** to a **Team**.

[app/models/team.rb](https://github.com/jbmilgrom/rails_crud_rspec/blob/master/app/models/team.rb)

    class Team < ActiveRecord::Base
      has_many :players, through: :contracts
      has_many :contracts
    end

[app/models/player.rb](https://github.com/jbmilgrom/rails_crud_rspec/blob/master/app/models/player.rb)

    class Player < ActiveRecord::Base
      has_many :teams, through: :contracts
      has_many :contracts
    end

[app/models/contract.rb](https://github.com/jbmilgrom/rails_crud_rspec/blob/master/app/models/contract.rb)

    class Contract < ActiveRecord::Base
      belongs_to :player
      belongs_to :team
    end

[db/schema.rb](https://github.com/jbmilgrom/rails_crud_rspec/blob/master/db/schema.rb)

    ActiveRecord::Schema.define(version: 20140706210328) do

     create_table "contracts", force: true do |t|
       t.integer "team_id"
       t.integer "player_id"
       t.integer "term"
       t.integer "deal_value"
     end

     create_table "players", force: true do |t|
       t.string "name"
       t.integer "height"
       t.datetime "created_at"
       t.datetime "updated_at"
     end

     create_table "teams", force: true do |t|
       t.string "name"
       t.string "city"
       t.datetime "created_at"
       t.datetime "updated_at"
     end

    end

Under the hood, the “player” in player_id and “team” in team_id in any instance of **Contract** are understood by Active Record to join such **Player** and **Team** through (as foreign keys of) an instance of **Contract.** @player.teams may then query the database for all :teams sharing an instance of **Contract** with @player and @team.players may query the database for all players sharing an instance of **Contract** with @team.

### Has_many | Belongs_to — Self Join Table

A table may have models that have relationships with other models in the same table. Instead of creating two independent tables, it often makes more sense to create a self-join table to account for these types of relationships. Rails documentation provides [a great example](http://guides.rubyonrails.org/association_basics.html#self-joins). In addition to having a name, phone number and other attributes, an **Employee** may also be a manager of _other_ **Employees**. In this example, a :subordinate may only have one :manager. Nonetheless, splitting the Employee model into two separate tables (maybe called Managers and Subordinates), duplicating code, and muddying entity relationships (what do you do when a subordinate gets promoted? How do you account for multilevel management, where a manager is the subordinate of another manager), offers a less-than-optimal solution. Here’s how a has_many | belongs_to self-join might work (taken from rails documentation linked above):

app/models/employee.rb

    class Employee < ActiveRecord::Base
     has_many :subordinates, class_name: “Employee”,
                             foreign_key: “manager_id”

     belongs_to :manager, class_name: “Employee”
    end

As can be seen in the above code, self referential relationships offer added complexity. :manager and :subordinates are both **Employees** in the database, but must be identified as such and distinguished. This is handled by supplying the :subordinates and :manager “names” expressly, and explicitly referencing, in each case, the class_name: to which such names apply, in each case, “Employee”.

Since each :subordinate may have only one :manager, a single column may be added when creating the **Employee** table to store the manager_id of each **Employee**’s (:subordinate’s) :manager, as is done below:

    class CreateEmployees < ActiveRecord::Migration
      def change
        create_table :employees do |t|
          t.references :manager

          t.timestamps
        end
      end
    end

To determine a :manager’s :subordinates (upon an @employee.subordinates call), Active Record may now look at each instance of **Employee** where the manager_id (i.e. foreign_key: :manager_id) of such :manager is stored in such **Employee**’s :manager column. To determine a :subordinate’s :manager (upon an @employee.manager call), Active Record may simply look at the :manager corresponding to the :manager_id stored in such **Employee**’s :manager column.

### Has_many | Has_many — Self Join Table

The above :subordinates | :manager example is useful only if a :subordinate belongs_to a single :manager. A different data structure is required if a :subordinate may have more than one :manager. The :follower | :followee paradigm used by Twitter and Instagram is analogous. A **User** can follow and be followed by any number of :users. In other words, a **User** can be both a :subordinate (:followee) and a :manager (:follower) without any restrictions on the number of :managers (:followers) associated with it in its :subordinate (:followee) capacity and the number of :subordinates (:followees) associated with it in its :manager (:follower) capacity. Here’s how a has_many | has_many self-join might work:

[app/models/user.rb](https://github.com/jbmilgrom/LEAf/blob/master/app/models/user.rb)

![](https://cdn-images-1.medium.com/max/2768/1*ae8lXxaCS6rwaJ6dV9BKaQ.png)

[app/models/follow.rb](https://github.com/jbmilgrom/LEAf/blob/master/app/models/follow.rb)

![](https://cdn-images-1.medium.com/max/2000/1*LFc2vG8Rk2PNgt3rjsM2eg.png)

The most important things to note are probably the terms :follower_follows and :followee_follows in user.rb, terms which I named as such for the following reasons (but could just as well been named :route_a and :route_b). Ordinarily, a join table between two independent objects is referenced identically in each model class. In the **Player** | **Team** example above, a **Team** may have many :players through :contracts. This is no different for a **Player**, who may have many :teams through :contracts as well. But in this case, where only one named model exists (i.e. a **User**), naming the through: relationship identically (i.e. through: :follow) would result in a naming collision for different use cases of, or access points into, the join table. Follower_follows and :followee_follows were created to avoid such a naming collision. Now, a **User** can have many :followers through :follower_follows and many :followees through :followee_follows.

To determine a **User**’s :followees (upon an @user.followees call), Active Record may now look at each instance of class_name: “Follow” where such **User** is the follower (i.e. foreign_key: :follower_id) through: such **User**’s :followee_follows. To determine a **User**’s :followers (upon an @user.followers call), Active Record may now look at each instance of class_name: “Follow” where such **User **is the followee (i.e. foreign_key: :followee_id) through: such **User**’s :follower_follows.
Done in 0.90s.
