import { PreviewType } from '../../Preview';
import * as Colors from '../../style/Colors';
import { IBtn } from '../../Btn';
import {
  urlImage,
  urlImage2,
  urlImage3,
  urlImage4,
  urlVideo,
} from '../../__stories__/mediaUrls';

const badges: IBtn[] = [
  {
    label: 'F',
    labelRequired: true,
    style: {
      minWidth: 40,
      top: 6,
      left: 8,
    },
  },
  {
    color: Colors.Green,
    label: '3',
    style: {
      top: 6,
      right: 8,
    },
  },
  {
    avatar: urlImage,
    style: {
      bottom: 6,
      left: 8,
    },
  },
  {
    color: Colors.Purple,
    icon: 'messenger',
    style: {
      bottom: 6,
      margin: 'auto',
      right: 0,
      left: 0,
    },
  },
];

const items = [
  {
    id: '3',
    idUser: 'userId1',
    idCustom: true,
    idString: '1Lorem',
    idSimpleDate: 1504691932985,
    idBool: true,
    idMultipleString: ['A', 'B', 'C', 'D'],
    idMultipleThumbnail: [
      {
        id: '1',
        srcUrl: urlImage,
        paperFold: true,
        placeholderIcon: 'photo',
        label: 'SHOOTING STILL LIFE',
        badges,
      },
      {
        id: 'video',
        srcUrl: urlVideo,
        srcType: PreviewType.VIDEO,
        placeholderIcon: 'movie',
      },
      {
        id: '12',
        srcUrl: urlImage2,
      },
      {
        id: '13',
        srcUrl: urlImage3,
      },
      {
        id: '14',
        srcUrl: urlImage4,
      },
    ],
    idIcon: 'settings',
    idAvatar: [
      {
        id: '0',
        label: 'Mario Cat',
        url: urlImage,
      },
      {
        id: '1',
        label: 'Luigi Cat',
        url: urlImage,
      },
      {
        id: '2',
        label: 'Peach Cat',
        url: urlImage2,
      },
      {
        id: '3',
        label: 'Bowser Cat',
        url: urlImage3,
      },
      {
        id: '4',
        label: 'Pipino Cat',
        url: urlImage4,
      },
    ],
    idDictionary: [{ value: 'dic1' }, { value: 'dic2' }, { value: 'dic3' }],
  },
  {
    id: '4',
    idUser: 'userId_Unknow',
    idCustom: true,
    idString: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    idSimpleDate: '2020-01-30',
    idBool: false,
    idMultipleString: ['views'],
    idIcon: 'home',
    idMultipleThumbnail: [
      {
        id: '21',
        srcUrl: urlImage,
      },
      {
        id: '22',
        srcUrl: urlImage2,
      },
    ],
    idAvatar: [
      {
        id: 'x',
        label: 'cat cat cat',
        url: urlImage,
      },
    ],
    idDictionary: undefined,
  },
];

export default items;
