"use client";

import BaselinePlate, { PLATE_SANS } from "../internal/BaselinePlate.js";
import type { PlateProps } from "../types.js";

/** Reference-guided artwork; source and design caveats are in plate-compare/references.ts. */
export default function WisconsinPlate(props: PlateProps) {
  return (
    <BaselinePlate {...props} state={props.state ?? "Wisconsin"}
      name="Wisconsin"
      colors={["#f5f5ef"]}
      heading="WISCONSIN"
      headingFont={PLATE_SANS}
      headingColor="#9c202c"
      headingSize={98}
      headingStyle="italic"
      headingWeight={800}
      headingWidth={520}
      headingX={302}
      headingY={93}
      ink="#080b08"
      footer="America's Dairyland"
      footerColor="#a3232d"
      footerSize={62}
      footerTextLength={522}
      footerFont="var(--font-plate-ny, sans-serif)"
      footerStyle="italic"
      footerWeight={400}
    >
      <path d="M26 109 H972" stroke="#193961" strokeWidth="5" />
      <path transform="translate(3 -6)" aria-label="Dairyland hills" fill="#34816c" fillRule="evenodd" d="M977,98 979,99 979,97Z M936,98 948,99 949,100 967,99 967,97 964,96 963,97 953,94 942,95Z M688,89 688,98 691,100 694,99 727,99 728,100 733,100 734,99 737,100 740,99 742,100 744,99 745,100 749,99 750,100 756,100 757,99 764,99 765,100 775,100 776,99 787,99 788,100 798,100 799,99 801,100 802,99 803,100 804,99 805,100 806,99 850,99 851,100 856,100 857,99 859,100 860,99 868,99 869,100 875,100 876,99 905,99 906,100 907,99 908,100 909,99 932,99 932,98 926,97 916,91 910,92 904,96 898,96 895,92 889,89 884,89 877,92 870,93 865,89 860,88 847,93 841,89 836,89 832,91 825,91 819,88 811,88 805,91 801,91 798,89 790,87 780,91 773,84 762,80 748,80 740,83 733,89 730,89 725,86 718,86 715,89 712,88 712,84 718,77 725,77 736,69 743,70 747,66 754,62 761,62 767,64 771,69 776,72 785,72 790,74 795,68 801,68 809,60 809,58 807,57 805,58 802,57 799,58 798,57 797,58 768,57 763,51 763,40 756,41 753,44 750,45 742,54 729,54 726,55 721,60 719,65 716,68 715,67 704,67 699,69 692,75 689,81 689,88Z" />
      <path transform="translate(3 -6)" aria-label="Barn roof and walls" fill="#9b2928" fillRule="evenodd" d="M923,81 923,67 921,68 916,67 912,68 903,67 901,68 898,65 897,61 897,43 896,42 896,34 897,33 894,30 883,30 881,31 881,42 879,44 865,36 862,36 858,38 855,41 851,42 847,46 844,53 840,57 831,59 819,72 825,74 827,76 827,81 850,81 851,80Z M852,70 853,73 851,75 850,72Z M864,47 867,50 865,53 862,51 862,49Z" />
      <path d="M852 42 V87 M826 84 V69 H840 V89 M864 63 H878 V80 H864Z M889 90 V63 H899 V90" fill="#4b292a" stroke="#4b292a" strokeWidth="3" />
      <path d="M617 97 L635 47 642 98Z" fill="#bd3b1e" /><path d="M615 93 A34 34 0 1 1 648 94 L642 38Z" fill="#c24b24" />
      <path d="M673 29 l10 6 9 -9 M698 22 l9 5 11 -7 M918 80 h46 m-40 -8 v17 m29 -17 v17" fill="none" stroke="#243a61" strokeWidth="3" />
    </BaselinePlate>
  );
}
