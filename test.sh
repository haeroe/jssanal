#grunt test | grep '\(^---\|WARN\|>> [^A][^s][^s][^e][^r][^t][^i][^o][^n].* - \)' | sed -n '/_TEST/p' | sed 's/>> /FAILED: /g'
grunt test | grep '\(^---\|WARN\|>> [^A][^s][^s][^e][^r][^t][^i][^o][^n].* - \)' | sed -n '/_TEST\|WARN/p' | sed 's/>> /FAILED: /g'
