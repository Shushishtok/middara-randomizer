# Middara Randomizer!

Welcome to the Middara Randomizer, a script-based application that allows you to play Middara with a twist: all items and Disciplines are randomized.
This means you have to learn to adapt and play with what you're given.
This adds a difficulty curve to the game, and is intended for experienced players.
Currently, this is based around the base game of Middara with 1.1 rules.

# How does it work?

Simple! You have a bunch of scripts that do all the work for you. You just have to run them, and occasionally also supply an argument or two to control them.
Running the script always goes like this:

```txt
npm run <scriptName> argument
```

Before running any of the game's script, the scripts must be built by running `npm run build`. If you can see a `dist` folder that showed up afterwards, it worked!

Following are the scripts prepared for you:

# Initializing the Adventurers

The `npm run init` script is used to create initial adventurers data in a JSON file to read and write from. This is only needed once the game begins, or if for some reason the file was lost.

This will also choose the primary discipline trees each adventurer will use when buying disciplines.

# Unlocking an Adventurer

Whenever the story unlocks a new adventurer to join your party, use `npm run unlock adventurerName` to unlock the adventurer, where `adventurerName` is the adventurer's name, such as `Zeke` or `Rook`. The script expects the name to be written correctly.

Unlocking an adventurer will also initialize it, similar to how `npm run init` works.

# Set Adventurer selectable/unselectable

Whenever the story causes an Adventurer to be unselectable, it cannot participate in Shop and Train phases the party is in. Therefore, relevant scripts will ignore those adventurers until they're selectable again. Run the script with `npm run set-selectable Rook false`, for example, to make Rook unselectable, or true to make Rook selectable again.

# Add Experience

Run `npm run add-xp <amount>` to add an amount of XP, usually rewarded as an encounter reward, to all adventurers. This includes locked and unselectable adventurers, as they are all supposed to have the same XP amounts. For example, use `npm run add-xp 5` to add XP to the party.

# Shop and Train

Use the shop and train script on Shop and Train phases (usually found in Story Rounds) to buy random items and disciplines with Gold and XP, respectively. As gold is shared between the entire party, the party will buy items in their loot level, from the categories: Weapons, Armors, Cores, Relics, Accessories, and Consumables. The script will cycle through this list randomly in an even manner, buying one of each until the item cost is too high. After no more items can be bought, the script will attempt to buy up to 5 random consumables from any loot level.

Additionally, Adventurers will spend all their XP on random disciplines, based on the chosen discipline trees when they initialized. Whenever an Adventurer chooses a discipline tree to get a discipline for, if the discipline tree is not maxed out (level 4), then it will try to get a random discipline in a higher level. Otherwise, it will get a random discipline from any level in that tree. The process repeats infinitely until a chosen discipline cannot be bought due to XP costs.

Run the script by typing `npm run shop-and-train`.

# Respec

Use the `npm run respec <adventurerName>` script to respec an adventurer. This will completely reinitialize it, removing its chosen disciplines and disicpline trees, and choosing new disciplines trees and disciplines from those new trees. Note that respeccing costs 1 XP, which is forever lost.

# New Story Round

Whenever adventurers reach a new Story Round, a random Unique item from the current loot level is placed on the shop for sale. Run the `npm run new-story-round` script in order to randomize which Unique item will be added to the shop, if any are available to buy.

Unique items in the shop are also considererd when buying items via the Shop and Train script.

SELF:
TODO: add script for adding items found during encounters to the items list in order to correctly remove them from the shop.
