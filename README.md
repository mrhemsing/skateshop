# Skateshop

Skateshop is a Next.js shared skate-video channel that plays a synchronized lineup inside a TV artwork composition.

## Local run

```bash
npm install
npm run build
npm run start -- --port 3002
```

Open:
- http://localhost:3002

## Channel lineup

Current video list in channel order:

1. `411VM - #01 (1993)`
2. `411VM - #02 (1993)`
3. `411VM - #03 (1993)`
4. `411VM - #04 (1994)`
5. `411VM - #05 (1994)`
6. `411VM - #06 (1994)`
7. `411VM - #07 (1994)`
8. `411VM - #08 (1994)`
9. `411VM - #09 (1994)`
10. `411VM - #10 (1995)`
11. `411VM - #11 (1995)`
12. `411VM - #12 (1995)`
13. `411VM - #13 (1995)`
14. `411VM - #14 (1996)`
15. `411VM - #16 (1996)`
16. `411VM - #17 (1996)`
17. `411VM - #18 (1996)`
18. `411VM - #19 (1996)`
19. `411VM - #20 (1997)`
20. `411VM - #21 (1997)`
21. `411VM - #22 (1997)`
22. `411VM - #23 (1997)`
23. `411VM - #24 (1997)`
24. `411VM - #25 (1997)`
25. `411VM - #26 (1998)`
26. `411VM - #27 (1998)`
27. `411VM - #28 (1998)`
28. `411VM - #29 (1998)`
29. `411VM - #30 (1998)`
30. `411VM - #31 (1998)`
31. `411VM - #32 (1999)`
32. `411VM - #33 (1999)`
33. `411VM - #34 (1999)`
34. `411VM - #35 (1999)`
35. `411VM - #36 (1999)`
36. `Toy Machine - Welcome To Hell (1996)`
37. `411 VM: Europe (1999)`
38. `XYZ Presents Stars and Bars (1995)`
39. `World Industries / Blind / 101 – Trilogy (1996)`
40. `Transworld - Uno (1996)`
41. `Transworld - Anthology (2000)`
42. `Girl - Mouse (1996)`
43. `Underachievers: Eastern Exposure 3 (1996)`
44. `Shorty's - Fulfill the Dream`
45. `TSA - "Life In The Fast Lane" (1997)`
46. `Blind - Video Days`
47. `Plan B - "Questionable" (1992)`
48. `Plan B - Virtual Reality`
49. `Zero - Thrill of It All`
50. `Transworld - The Reason (1999)`
51. `Alien Workshop - Memory Screen`
52. `Zoo York Mixtape - The Original`
53. `Foundation - Art Bars, Subtitles and Seagulls (2001)`
54. `Think - "Damage" (1996)`
55. `Birdhouse - "The End" (1998)`
56. `Chocolate - "Las Nueve Vidas De Paco" (1995)`
57. `FTC - "Penal Code 100A" (1996)`

## Notes

- Live app runs on **port 3002**.
- Current background artwork: `public/skate-shop-bg.webp`
- Mobile portrait shows a rotate prompt with a looping kickflip clip.
- The channel is designed to feel **always live** rather than like an on-demand player.
- Audio is muted by default and can be toggled with the speaker button.
- `Issue #15` and `Issue #37` are still missing from the current 411VM run.
