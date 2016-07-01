## tournament result prediction
The tournament can be considered as a binary tree, where node `i` represents the winner of its children. Each node of the tree is a set of key-value pairs, where the key is the name of a team, and the value is a probability. To be more specific, `tree[i][t]` represents the probability of team `t` being present at node `i`.

Initially all the 16 teams are located at leaves. The algorithm calculates round by round, bottom-up the value of `tree[i][t]`: for all the pair of teams `l` from `tree[2*i+1]` and `r` from `tree[2*i+2]`, calculate the probability of `l` winning against `r` in a single match, and then multiply it with the probability of the match between them to happen (which should be `tree[2*i+1][l] * tree[2*i+2][r]`), result of which is added to `tree[i][l]`.

Now `tree[0]` is all we want.
