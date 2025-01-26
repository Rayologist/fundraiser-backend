import { Currency } from '@common/ddd/money';
import { ReceiptMailer } from '@common/mailer/mailers/receipt.mailer';
import { CreateCampaignUseCase } from '@domains/fundraiser/campaign/application/create-campaign/create-campaign.use-case';
import {
  CreateProductInput,
  CreateProductUseCase,
} from '@domains/fundraiser/product/application/create-product/create-product.use-case';
import { Injectable } from '@nestjs/common';
import { ulid } from 'ulidx';

@Injectable()
export class InternalService {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly createProductUseCase: CreateProductUseCase,

    private readonly receiptMailer: ReceiptMailer,
  ) {}
  async init() {
    const gil = await this.createCampaignUseCase.execute({
      title: '語言所搬遷/30週年基金募款',
      description:
        '台灣大學語言所即將喬遷至嶄新的人文大樓！為了提供師生更優質的教研環境，我們規劃了四大重點空間: 學生空間、訪問學人辦公室、隔音錄音室、智慧教室。',
      longDescription: `親愛的朋友們，2025年初，臺大語言所將帶著滿滿的回憶，告別師生成長的樂學館，搬遷至充滿現代與傳統交融氣息的人文大樓。樂學館的走廊和窗外的風景見證了無數次的課堂討論、研究突破，也陪伴師生度過無數深夜的學習時光。如今，臺大語言所將帶著這些寶貴的記憶，進入新的空間，期待在新的環境中再次啟航。為了讓臺大語言所的師生們在新大樓能夠安心學習與研究，協會希望能協助為學生們規劃更舒適的自習空間、提供更具互動性以及智能視訊設備的多功能教室、並在人文大樓打造新的隔音錄音室，為未來臺大語言所的發展注入更多的動力，讓每一位師生都能在這裡找到自己的成長舞台。這次的搬遷是臺大語言所師生集體夢想的延續。我們誠摯地邀請您加入這段旅程，成為語言所故事的一部分。竭誠期盼所胞們能以實際行動支持臺大語言所的發展，無論是一筆捐款或是小額支持，都將化為我們前行的力量。讓我們攜手合作，為臺大語言所打造一個充滿活力的新家，共同見證臺灣語言研究的蓬勃發展。期待2025六月臺大語言所所慶我們能共聚一堂，一同回憶樂學館的點滴，也一起開箱新大樓！`,
      active: true,
      pictures: [
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488379/image1_uo0olz.png',
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488379/image5_d2rktt.jpg',
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737573814/activities.a1617b10_vtmsvj.jpg',
      ],
      config: {
        color: {
          primary: '#0b7285',
          secondary: '#15aabf',
        },
      },
    });

    if (gil.isErr()) {
      throw gil.error.message;
    }

    const inputs: CreateProductInput[] = [
      {
        title: '不指定用途',
        description: '',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 0,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '學生空間',
        description:
          '硬體設備費用包含30組OA桌椅共240,000元（每組8,000元）、2張沙發共40,000元（每張20,000元）、2片磁性烤玻白板共20,000元（每片10,000元），總計新台幣300,000元整。',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 300000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '訪問學人辦公室',
        description:
          '裝修工程費用包含隔間及空調工程300,000元、2組OA桌椅共16,000元（每組8,000元）、2個櫃子共9,000元（每個4,500元），總計新台幣325,000元整。',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 325000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '認知實驗室',
        description:
          '認知實驗室設備建置費用共計3間，每間100,000元，總計新台幣300,000元整。',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 300000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '伺服器機房',
        description: '伺服器機房建置費用為新台幣100,000元整。',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 100000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '智慧教室',
        description:
          '智慧教室設備費用包含2台65吋電視共40,000元（每台20,000元）、24組課桌椅共120,000元（每組5,000元）、影音設備340,000元，總計新台幣500,000元整。',
        campaignId: gil.value.id,
        pictures: [],
        goalAmount: 500000,
        currency: Currency.TWD,
        active: true,
      },
    ];

    inputs.forEach(async (input) => {
      const product = await this.createProductUseCase.execute(input);
      if (product.isErr()) {
        throw product.error.message;
      }
    });

    const tol = await this.createCampaignUseCase.execute({
      title: '2025國際奧林匹亞語言學競賽經費',
      longDescription:
        '臺大語言所將於2025年7月主辦第22屆國際語言學奧林匹亞競賽，這不僅是語言知識競賽，更是促進全球學術交流的重要平台。我們期望藉由這次競賽，讓來自世界各地的參賽者感受到台灣在語言學教育與研究上的卓越實力以及在國際賽事中的優秀組織能力。為了讓2025國際語奧競賽能夠順利進行，我們發起了此次募款活動，為賽事的住宿、場地租借、膳食以及各項活動籌集經費。希望透過您的支持，為我們打造一個優質的競賽環境。無論您是個人或團體，都可以根據需求選擇認購特定項目或金額。我們提供多種支付方式，包括線上刷卡、ATM匯款，還有定期小額捐款等選項，讓每位支持者都能輕鬆參與。每一份捐助，都是我們成功舉辦賽事的重要力量。讓我們攜手合作，為2025國際語奧競賽注入更多能量，讓台灣在國際學術舞台上閃耀光芒！',
      description:
        '臺灣榮獲國際語奧委員會邀請，將主辦2025年第二十二屆國際語奧賽事！這不僅是對臺灣語奧發展的肯定，也是臺灣在國際學術舞台上發光發熱的象徵。',
      active: true,
      pictures: [
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488471/image16_mekzbo.jpg',
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488471/image8_y2cr3m.jpg',
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488468/image1_k5waiw.jpg',
        'https://res.cloudinary.com/dankjwppl/image/upload/v1737488473/image19_yabmzk.jpg',
      ],
      config: {
        color: {
          primary: '#087F5B',
          secondary: '#40c057',
        },
      },
    });

    if (tol.isErr()) {
      throw tol.error.message;
    }

    const tolInputs: CreateProductInput[] = [
      {
        title: '不指定用途',
        description: '',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 0,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '住宿費用',
        description:
          '住宿七日費用包含：每日每間3,900元的4人房27間、每日每間2,200元的2人房25間、每日每間3,200元的3人房2間、每日每間5,300元的6人房2間，共計56間房，每日177,300元，總計新台幣1,241,100元整。',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 1241100,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '場地租借費',
        description:
          '7/20（第0天）共計30,820元，含評審會議及工作人員會議；7/21（第1天）共計115,100元，含開幕式及午晚餐；7/22（第2天）共計70,000元，為個人賽；7/23（第3天）共計39,340元，為評審批改；7/25（第5天）共計595,480元，含團體賽、演講、Jeopardy活動、用餐及評審批改；7/26（第6天）共計97,920元，含解題、閉幕式及午餐；七天場地費用總計新台幣948,660元整。',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 948660,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '膳食費用',
        description:
          '七天活動期間，預計每人每餐120元，供應350人共20頓餐點，總計餐飲費用為新台幣840,000元整。',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 840000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '活動費',
        description:
          '活動費用包含文化之夜的個人演出及臺灣美食手作活動150,000元、文化遊覽活動30,000元、語奧傳統益智活動 Jeopardy 20,000元，總計新台幣200,000元整。',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 200000,
        currency: Currency.TWD,
        active: true,
      },
      {
        title: '人事費用',
        description:
          '人事費用包含一位碩士級兼任助理年薪72,000元（每月6,000元，共12個月）及網路系統外包費用350,000元（含網路系統及技術支持），總計新台幣422,000元整。',
        campaignId: tol.value.id,
        pictures: [],
        goalAmount: 422000,
        currency: Currency.TWD,
        active: true,
      },
    ];

    tolInputs.forEach(async (input) => {
      const product = await this.createProductUseCase.execute(input);
      if (product.isErr()) {
        throw product.error.message;
      }
    });
  }

  async sendReceipt(args: { to: string }) {
    await this.receiptMailer.send({
      to: args.to,
      receipt: {
        id: ulid(),
        userId: 'admin-receipt-tester',
        date: new Date(),
        donation: {
          method: '信用卡付款',
          amount: 300000,
          type: '台灣語言文化與資訊協會預算測試、台灣語言文化與資訊業務費測試',
        },
        donor: {
          name: '握小明',
          taxId: 'A123456789',
        },
        notes: '---',
      },
    });
  }
}
