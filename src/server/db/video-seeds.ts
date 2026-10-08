export interface VideoSentence {
  id: string;
  start: number; // seconds
  end: number; // seconds
  textEn: string;
  textVi: string;
  note?: string;
  keyPhrases?: { phrase: string; meaningVi: string }[];
}

export interface VideoLesson {
  id: string;
  slug: string;
  youtubeId: string;
  title: string;
  description: string;
  topic: "Daily Conversations" | "Tech & Developer" | "Job Interview" | "Business & Work" | "Inspirational";
  level: "A2" | "B1" | "B2";
  durationSeconds: number;
  thumbnailUrl?: string;
  channelTitle?: string;
  sentences: VideoSentence[];
  createdAt?: string;
  isCustom?: boolean;
}

export const SEED_VIDEO_LESSONS: VideoLesson[] = [
  // 1. Derek Sivers: How to Start a Movement (100% Full Video Transcript - 36 sentences)
  {
    id: "video-derek-sivers",
    slug: "derek-sivers-how-to-start-a-movement",
    youtubeId: "V74AxCqOTvg",
    title: "Derek Sivers: How to Start a Movement",
    description: "World-famous TED Talk demonstrating how leadership is over-glorified and how the first follower actually transforms a lone nut into a leader. 100% full video transcript.",
    topic: "Business & Work",
    level: "B1",
    durationSeconds: 189,
    channelTitle: "TED",
    sentences: [
  {
    "id": "ds-1",
    "start": 16.1,
    "end": 20.7,
    "textEn": "Ladies and gentlemen, at TED we talk a lot about leadership and how to make a movement.",
    "textVi": "Thưa quí vị, tại TED, chúng ta nói nhiều về lãnh đạo và cách tạo nên một phong trào.",
    "keyPhrases": [
      {
        "phrase": "make a movement",
        "meaningVi": "tạo ra một phong trào"
      }
    ]
  },
  {
    "id": "ds-2",
    "start": 20.7,
    "end": 26.2,
    "textEn": "So let's watch a movement happen, start to finish, in under three minutes and dissect some lessons from it.",
    "textVi": "Vậy hãy cùng xem một phong trào diễn ra từ đầu đến cuối trong vòng chưa đầy ba phút và rút ra một số bài học từ đó.",
    "keyPhrases": [
      {
        "phrase": "dissect some lessons",
        "meaningVi": "phân tích một số bài học"
      }
    ]
  },
  {
    "id": "ds-3",
    "start": 26.3,
    "end": 31.1,
    "textEn": "First, of course you know, a leader needs the guts to stand out and be ridiculed.",
    "textVi": "Đầu tiên, tất nhiên các bạn biết đấy, một người lãnh đạo cần sự dũng cảm để nổi bật và chịu sự chế giễu.",
    "keyPhrases": [
      {
        "phrase": "stand out",
        "meaningVi": "nổi bật"
      },
      {
        "phrase": "ridiculed",
        "meaningVi": "bị chế giễu"
      }
    ]
  },
  {
    "id": "ds-4",
    "start": 32.7,
    "end": 34.5,
    "textEn": "What he's doing is so easy to follow.",
    "textVi": "Những gì anh ấy đang làm rất dễ để làm theo.",
    "keyPhrases": []
  },
  {
    "id": "ds-5",
    "start": 34.5,
    "end": 39.2,
    "textEn": "Here's his first follower with a crucial role; he's going to show everyone else how to follow.",
    "textVi": "Và đây là người đi theo đầu tiên với một vai trò cốt yếu; anh ấy sẽ cho mọi người thấy cách để đi theo.",
    "keyPhrases": []
  },
  {
    "id": "ds-6",
    "start": 39.3,
    "end": 41.8,
    "textEn": "Now, notice that the leader embraces him as an equal.",
    "textVi": "Bây giờ, hãy chú ý rằng người lãnh đạo coi anh ấy như một người bình đẳng.",
    "keyPhrases": []
  },
  {
    "id": "ds-7",
    "start": 41.8,
    "end": 45.2,
    "textEn": "Now it's not about the leader anymore; it's about them, plural.",
    "textVi": "Lúc này mọi chuyện không còn xoay quanh người lãnh đạo nữa; mà là về tất cả bọn họ.",
    "keyPhrases": []
  },
  {
    "id": "ds-8",
    "start": 45.7,
    "end": 47.8,
    "textEn": "Now, there he is calling to his friends.",
    "textVi": "Kìa, anh ấy đang gọi những người bạn của mình.",
    "keyPhrases": []
  },
  {
    "id": "ds-9",
    "start": 47.8,
    "end": 53.2,
    "textEn": "Now, if you notice that the first follower is actually an underestimated form of leadership in itself.",
    "textVi": "Nếu để ý, bạn sẽ thấy người đi theo đầu tiên thực chất là một hình thức lãnh đạo bị đánh giá thấp nhưng vô cùng quan trọng.",
    "keyPhrases": []
  },
  {
    "id": "ds-10",
    "start": 53.3,
    "end": 55.2,
    "textEn": "It takes guts to stand out like that.",
    "textVi": "Cần phải có sự dũng cảm để nổi bật như vậy.",
    "keyPhrases": []
  },
  {
    "id": "ds-11",
    "start": 55.7,
    "end": 60.2,
    "textEn": "The first follower is what transforms a lone nut into a leader.",
    "textVi": "Người đi theo đầu tiên chính là nhân tố biến một kẻ khùng đơn độc thành một nhà lãnh đạo.",
    "keyPhrases": []
  },
  {
    "id": "ds-12",
    "start": 65.5,
    "end": 67.2,
    "textEn": "And here comes a second follower.",
    "textVi": "Và người đi theo thứ hai đã xuất hiện.",
    "keyPhrases": []
  },
  {
    "id": "ds-13",
    "start": 67.3,
    "end": 72.2,
    "textEn": "Now it's not a lone nut, it's not two nuts -- three is a crowd, and a crowd is news.",
    "textVi": "Bây giờ không còn là một kẻ khùng đơn độc, cũng không phải hai kẻ khùng -- ba người là thành một đám đông, và đám đông chính là tin tức.",
    "keyPhrases": []
  },
  {
    "id": "ds-14",
    "start": 72.3,
    "end": 74.2,
    "textEn": "So a movement must be public.",
    "textVi": "Vì vậy, một phong trào phải mang tính công khai.",
    "keyPhrases": []
  },
  {
    "id": "ds-15",
    "start": 74.6,
    "end": 81.8,
    "textEn": "It's important to show not just the leader, but the followers, because you find that new followers emulate the followers, not the leader.",
    "textVi": "Điều quan trọng là cho thấy không chỉ người lãnh đạo, mà cả những người đi theo, bởi vì bạn sẽ thấy những người đi theo mới bắt chước những người đi theo trước đó, chứ không phải người lãnh đạo.",
    "keyPhrases": []
  },
  {
    "id": "ds-16",
    "start": 82.3,
    "end": 86.2,
    "textEn": "Now, here come two more people, and immediately after, three more people.",
    "textVi": "Bây giờ, hai người nữa lại đến, và ngay sau đó là ba người nữa.",
    "keyPhrases": []
  },
  {
    "id": "ds-17",
    "start": 86.3,
    "end": 88.7,
    "textEn": "Now we've got momentum. This is the tipping point.",
    "textVi": "Bây giờ chúng ta đã có đà. Đây chính là điểm bùng phát.",
    "keyPhrases": []
  },
  {
    "id": "ds-18",
    "start": 88.7,
    "end": 90.5,
    "textEn": "Now we've got a movement.",
    "textVi": "Bây giờ chúng ta đã có một phong trào.",
    "keyPhrases": []
  },
  {
    "id": "ds-19",
    "start": 91.9,
    "end": 95.8,
    "textEn": "So, notice that, as more people join in, it's less risky.",
    "textVi": "Hãy chú ý rằng, khi có nhiều người tham gia hơn, rủi ro sẽ ít đi.",
    "keyPhrases": []
  },
  {
    "id": "ds-20",
    "start": 95.8,
    "end": 99.6,
    "textEn": "So those that were sitting on the fence before now have no reason not to.",
    "textVi": "Vì vậy, những người từng chần chừ do dự trước đó giờ không có lý do gì để từ chối nữa.",
    "keyPhrases": []
  },
  {
    "id": "ds-21",
    "start": 99.6,
    "end": 105.8,
    "textEn": "They won't stand out, they won't be ridiculed, but they will be part of the in-crowd if they hurry.",
    "textVi": "Họ sẽ không bị nổi bật, không bị chế giễu, và họ sẽ trở thành một phần của nhóm trung tâm nếu họ nhanh chân.",
    "keyPhrases": []
  },
  {
    "id": "ds-22",
    "start": 108.6,
    "end": 112.9,
    "textEn": "So, over the next minute, you'll see all of those that prefer to stick with the crowd.",
    "textVi": "Vì vậy, trong phút tiếp theo, bạn sẽ thấy tất cả những người thích hòa theo số đông.",
    "keyPhrases": []
  },
  {
    "id": "ds-23",
    "start": 112.9,
    "end": 116.2,
    "textEn": "Because eventually they would be ridiculed for not joining in.",
    "textVi": "Bởi vì cuối cùng họ sẽ bị chế giễu nếu không tham gia.",
    "keyPhrases": []
  },
  {
    "id": "ds-24",
    "start": 116.2,
    "end": 118.2,
    "textEn": "And that's how you make a movement.",
    "textVi": "Và đó là cách bạn tạo ra một phong trào.",
    "keyPhrases": []
  },
  {
    "id": "ds-25",
    "start": 118.2,
    "end": 120.2,
    "textEn": "But let's recap some lessons from this.",
    "textVi": "Nhưng hãy điểm lại một số bài học từ việc này.",
    "keyPhrases": []
  },
  {
    "id": "ds-26",
    "start": 120.9,
    "end": 126.2,
    "textEn": "So first, if you are the type, like the shirtless dancing guy that is standing alone,.",
    "textVi": "Đầu tiên, nếu bạn thuộc tuýp người, giống như anh chàng nhảy múa cởi trần đứng một mình...",
    "keyPhrases": []
  },
  {
    "id": "ds-27",
    "start": 126.3,
    "end": 132.7,
    "textEn": "Remember the importance of nurturing your first few followers as equals so it's clearly about the movement, not you.",
    "textVi": "Hãy nhớ tầm quan trọng của việc đối xử với những người đi theo đầu tiên như những người bình đẳng để rõ ràng rằng mọi thứ là vì phong trào, không phải vì bạn.",
    "keyPhrases": []
  },
  {
    "id": "ds-28",
    "start": 133.8,
    "end": 136.3,
    "textEn": "Okay, but we might have missed the real lesson here.",
    "textVi": "Được rồi, nhưng có lẽ chúng ta đã bỏ lỡ bài học thực sự ở đây.",
    "keyPhrases": []
  },
  {
    "id": "ds-29",
    "start": 136.4,
    "end": 142.2,
    "textEn": "The biggest lesson, if you noticed -- did you catch it? -- is that leadership is over-glorified.",
    "textVi": "Bài học lớn nhất, nếu bạn để ý -- bạn có nhận ra không? -- đó là lãnh đạo đang được tôn sùng quá mức.",
    "keyPhrases": []
  },
  {
    "id": "ds-30",
    "start": 143,
    "end": 148.4,
    "textEn": "Yes, it was the shirtless guy who was first, and he'll get all the credit, but it was really the first follower.",
    "textVi": "Đúng vậy, chính anh chàng cởi trần là người đầu tiên, và anh ấy sẽ nhận hết công trạng, nhưng thực ra chính là người đi theo đầu tiên...",
    "keyPhrases": []
  },
  {
    "id": "ds-31",
    "start": 148.4,
    "end": 151.2,
    "textEn": "That transformed the lone nut into a leader.",
    "textVi": "...mới là người biến kẻ khùng đơn độc thành nhà lãnh đạo.",
    "keyPhrases": []
  },
  {
    "id": "ds-32",
    "start": 151.7,
    "end": 155.6,
    "textEn": "So, as we're told that we should all be leaders, that would be really ineffective.",
    "textVi": "Vì vậy, khi chúng ta được bảo rằng tất cả nên làm lãnh đạo, điều đó thực sự sẽ không hiệu quả.",
    "keyPhrases": []
  },
  {
    "id": "ds-33",
    "start": 155.6,
    "end": 161.2,
    "textEn": "If you really care about starting a movement, have the courage to follow and show others how to follow.",
    "textVi": "Nếu bạn thực sự quan tâm đến việc bắt đầu một phong trào, hãy có dũng khí để đi theo và chỉ cho người khác cách đi theo.",
    "keyPhrases": []
  },
  {
    "id": "ds-34",
    "start": 161.3,
    "end": 167.2,
    "textEn": "And when you find a lone nut doing something great, have the guts to be the first one to stand up and join in.",
    "textVi": "Và khi bạn thấy một kẻ khùng đơn độc đang làm điều gì đó tuyệt vời, hãy có gan là người đầu tiên đứng lên và tham gia.",
    "keyPhrases": []
  },
  {
    "id": "ds-35",
    "start": 167.3,
    "end": 169.6,
    "textEn": "And what a perfect place to do that, at TED.",
    "textVi": "Và quả là một nơi hoàn hảo để làm điều đó, chính tại TED.",
    "keyPhrases": []
  },
  {
    "id": "ds-36",
    "start": 170,
    "end": 171.2,
    "textEn": "Thanks.",
    "textVi": "Cảm ơn các bạn.",
    "keyPhrases": []
  }
],
  },

  // 2. Matt Cutts: Try Something New for 30 Days (100% Full Video Transcript - 39 sentences)
  {
    id: "video-matt-cutts",
    slug: "matt-cutts-try-something-new-30-days",
    youtubeId: "JnfBXjWm7hc",
    title: "Matt Cutts: Try Something New for 30 Days",
    description: "Inspiring and easy-to-follow TED Talk about building positive habits in 30 days. Complete full-speech transcription from start to finish.",
    topic: "Daily Conversations",
    level: "A2",
    durationSeconds: 207,
    channelTitle: "TED",
    sentences: [
  {
    "id": "mc-1",
    "start": 15.3,
    "end": 22.2,
    "textEn": "A few years ago, I felt like I was stuck in a rut, so I decided to follow in the footsteps.",
    "textVi": "Vài năm trước, tôi cảm thấy mình như đang giậm chân tại chỗ, thế nên tôi quyết định noi theo bước chân.",
    "keyPhrases": [
      {
        "phrase": "stuck in a rut",
        "meaningVi": "giậm chân tại chỗ, sống nhàm chán theo lối mòn"
      }
    ]
  },
  {
    "id": "mc-2",
    "start": 22.3,
    "end": 28.2,
    "textEn": "Of the great American philosopher, Morgan Spurlock, and try something new for 30 days.",
    "textVi": "Của triết gia vĩ đại người Mỹ, Morgan Spurlock, và thử làm điều gì đó mới mẻ trong 30 ngày.",
    "keyPhrases": []
  },
  {
    "id": "mc-3",
    "start": 28.8,
    "end": 30.5,
    "textEn": "The idea is actually pretty simple.",
    "textVi": "Ý tưởng thực ra khá đơn giản.",
    "keyPhrases": []
  },
  {
    "id": "mc-4",
    "start": 30.9,
    "end": 36.2,
    "textEn": "Think about something you've always wanted to add to your life and try it for the next 30 days.",
    "textVi": "Hãy nghĩ về điều gì đó bạn luôn muốn thêm vào cuộc sống của mình và thử làm nó trong 30 ngày tới.",
    "keyPhrases": []
  },
  {
    "id": "mc-5",
    "start": 37.2,
    "end": 43.3,
    "textEn": "It turns out 30 days is just about the right amount of time to add a new habit or subtract a habit --.",
    "textVi": "Hóa ra 30 ngày là khoảng thời gian vừa đủ để thêm một thói quen mới hoặc loại bỏ một thói quen --.",
    "keyPhrases": []
  },
  {
    "id": "mc-6",
    "start": 43.3,
    "end": 46.2,
    "textEn": "Like watching the news -- from your life.",
    "textVi": "Giống như việc xem tin tức -- ra khỏi cuộc sống của bạn.",
    "keyPhrases": []
  },
  {
    "id": "mc-7",
    "start": 46.3,
    "end": 49.5,
    "textEn": "There's a few things I learned while doing these 30-day challenges.",
    "textVi": "Có một vài điều tôi học được khi thực hiện các thử thách 30 ngày này.",
    "keyPhrases": []
  },
  {
    "id": "mc-8",
    "start": 49.9,
    "end": 57.2,
    "textEn": "The first was, instead of the months flying by, forgotten, the time was much more memorable.",
    "textVi": "Điều đầu tiên là, thay vì những tháng ngày trôi qua nhanh chóng và bị lãng quên, thời gian trở nên đáng nhớ hơn rất nhiều.",
    "keyPhrases": []
  },
  {
    "id": "mc-9",
    "start": 57.3,
    "end": 60.8,
    "textEn": "This was part of a challenge I did to take a picture every day for a month.",
    "textVi": "Đây là một phần trong thử thách chụp một bức ảnh mỗi ngày trong suốt một tháng của tôi.",
    "keyPhrases": []
  },
  {
    "id": "mc-10",
    "start": 60.9,
    "end": 65.3,
    "textEn": "And I remember exactly where I was and what I was doing that day.",
    "textVi": "Và tôi nhớ chính xác mình đang ở đâu và đang làm gì vào ngày hôm đó.",
    "keyPhrases": []
  },
  {
    "id": "mc-11",
    "start": 66.4,
    "end": 72.2,
    "textEn": "I also noticed that as I started to do more and harder 30-day challenges, my self-confidence grew.",
    "textVi": "Tôi cũng nhận thấy rằng khi tôi bắt đầu thực hiện nhiều thử thách 30 ngày khó hơn, sự tự tin của tôi đã tăng lên.",
    "keyPhrases": []
  },
  {
    "id": "mc-12",
    "start": 72.8,
    "end": 77.2,
    "textEn": "I went from desk-dwelling computer nerd to the kind of guy who bikes to work.",
    "textVi": "Tôi đã chuyển từ một tên mọt máy tính suốt ngày ngồi bàn giấy thành kiểu người đạp xe đi làm.",
    "keyPhrases": []
  },
  {
    "id": "mc-13",
    "start": 77.9,
    "end": 79.1,
    "textEn": "For fun!",
    "textVi": "Vì vui thôi!",
    "keyPhrases": []
  },
  {
    "id": "mc-14",
    "start": 80.5,
    "end": 85.2,
    "textEn": "Even last year, I ended up hiking up Mt. Kilimanjaro, the highest mountain in Africa.",
    "textVi": "Ngay cả năm ngoái, tôi cuối cùng đã leo lên đỉnh núi Kilimanjaro, ngọn núi cao nhất châu Phi.",
    "keyPhrases": []
  },
  {
    "id": "mc-15",
    "start": 85.3,
    "end": 90.3,
    "textEn": "I would never have been that adventurous before I started my 30-day challenges.",
    "textVi": "Tôi sẽ không bao giờ dám mạo hiểm như vậy trước khi bắt đầu các thử thách 30 ngày của mình.",
    "keyPhrases": []
  },
  {
    "id": "mc-16",
    "start": 91.3,
    "end": 98.2,
    "textEn": "I also figured out that if you really want something badly enough, you can do anything for 30 days.",
    "textVi": "Tôi cũng nhận ra rằng nếu bạn thực sự muốn điều gì đó đủ nhiều, bạn có thể làm bất cứ điều gì trong 30 ngày.",
    "keyPhrases": []
  },
  {
    "id": "mc-17",
    "start": 99.4,
    "end": 101.2,
    "textEn": "Have you ever wanted to write a novel?",
    "textVi": "Bạn đã bao giờ muốn viết một cuốn tiểu thuyết chưa?",
    "keyPhrases": []
  },
  {
    "id": "mc-18",
    "start": 102.2,
    "end": 108.9,
    "textEn": "Every November, tens of thousands of people try to write their own 50,000-word novel, from scratch,.",
    "textVi": "Cứ đến tháng 11 hàng năm, hàng chục ngàn người cố gắng viết cuốn tiểu thuyết 50.000 từ của riêng họ, từ con số không,.",
    "keyPhrases": []
  },
  {
    "id": "mc-19",
    "start": 109,
    "end": 110.2,
    "textEn": "In 30 days.",
    "textVi": "Trong vòng 30 ngày.",
    "keyPhrases": []
  },
  {
    "id": "mc-20",
    "start": 110.9,
    "end": 117,
    "textEn": "It turns out, all you have to do is write 1,667 words a day for a month.",
    "textVi": "Hóa ra, tất cả những gì bạn phải làm là viết 1.667 từ mỗi ngày trong một tháng.",
    "keyPhrases": []
  },
  {
    "id": "mc-21",
    "start": 117.8,
    "end": 119.2,
    "textEn": "So I did.",
    "textVi": "Thế là tôi đã làm vậy.",
    "keyPhrases": []
  },
  {
    "id": "mc-22",
    "start": 119.3,
    "end": 124.2,
    "textEn": "By the way, the secret is not to go to sleep until you've written your words for the day.",
    "textVi": "Nhân tiện, bí quyết là đừng đi ngủ cho đến khi bạn viết xong số từ của ngày hôm đó.",
    "keyPhrases": []
  },
  {
    "id": "mc-23",
    "start": 124.8,
    "end": 128,
    "textEn": "You might be sleep-deprived, but you'll finish your novel.",
    "textVi": "Bạn có thể bị thiếu ngủ, nhưng bạn sẽ hoàn thành cuốn tiểu thuyết của mình.",
    "keyPhrases": []
  },
  {
    "id": "mc-24",
    "start": 129,
    "end": 132.2,
    "textEn": "Now is my book the next great American novel?",
    "textVi": "Giờ thì cuốn sách của tôi có phải là một tiểu thuyết lớn tiếp theo của nước Mỹ không?",
    "keyPhrases": []
  },
  {
    "id": "mc-25",
    "start": 132.7,
    "end": 134.2,
    "textEn": "No. I wrote it in a month.",
    "textVi": "Không. Tôi viết nó trong một tháng mà.",
    "keyPhrases": []
  },
  {
    "id": "mc-26",
    "start": 134.3,
    "end": 136.1,
    "textEn": "It's awful.",
    "textVi": "Nó tệ khủng khiếp.",
    "keyPhrases": []
  },
  {
    "id": "mc-27",
    "start": 137.8,
    "end": 142.2,
    "textEn": "But for the rest of my life, if I meet John Hodgman at a TED party,.",
    "textVi": "Nhưng trong phần đời còn lại của mình, nếu tôi gặp John Hodgman tại một buổi tiệc TED,.",
    "keyPhrases": []
  },
  {
    "id": "mc-28",
    "start": 142.3,
    "end": 149.6,
    "textEn": "I don't have to say, \"I'm a computer scientist.\" No, no, if I want to, I can say, \"I'm a novelist.\".",
    "textVi": "Tôi không phải nói, \"Tôi là một nhà khoa học máy tính.\" Không, không, nếu tôi muốn, tôi có thể nói, \"Tôi là một tiểu thuyết gia.\"",
    "keyPhrases": []
  },
  {
    "id": "mc-29",
    "start": 153,
    "end": 155.2,
    "textEn": "So here's one last thing I'd like to mention.",
    "textVi": "Và đây là điều cuối cùng tôi muốn nhắc đến.",
    "keyPhrases": []
  },
  {
    "id": "mc-30",
    "start": 155.3,
    "end": 162.5,
    "textEn": "I learned that when I made small, sustainable changes, things I could keep doing, they were more likely to stick.",
    "textVi": "Tôi học được rằng khi tôi thực hiện những thay đổi nhỏ, có thể duy trì, những thứ tôi có thể tiếp tục làm, chúng có khả năng gắn bó lâu dài hơn.",
    "keyPhrases": []
  },
  {
    "id": "mc-31",
    "start": 162.5,
    "end": 165.2,
    "textEn": "There's nothing wrong with big, crazy challenges.",
    "textVi": "Không có gì sai với những thử thách lớn lao, điên rồ cả.",
    "keyPhrases": []
  },
  {
    "id": "mc-32",
    "start": 165.3,
    "end": 167.6,
    "textEn": "In fact, they're a ton of fun.",
    "textVi": "Trên thực tế, chúng rất thú vị.",
    "keyPhrases": []
  },
  {
    "id": "mc-33",
    "start": 168.1,
    "end": 169.7,
    "textEn": "But they're less likely to stick.",
    "textVi": "Nhưng chúng ít có khả năng trở thành thói quen lâu dài hơn.",
    "keyPhrases": []
  },
  {
    "id": "mc-34",
    "start": 170.5,
    "end": 174.9,
    "textEn": "When I gave up sugar for 30 days, day 31 looked like this.",
    "textVi": "Khi tôi từ bỏ đường trong 30 ngày, ngày thứ 31 trông giống thế này đây.",
    "keyPhrases": []
  },
  {
    "id": "mc-35",
    "start": 177.3,
    "end": 181.5,
    "textEn": "So here's my question to you: What are you waiting for?",
    "textVi": "Vậy câu hỏi của tôi dành cho bạn là: Bạn còn chờ gì nữa?",
    "keyPhrases": []
  },
  {
    "id": "mc-36",
    "start": 181.5,
    "end": 187.4,
    "textEn": "I guarantee you the next 30 days are going to pass whether you like it or not,.",
    "textVi": "Tôi đảm bảo với bạn là 30 ngày tới sẽ trôi qua dù bạn có muốn hay không,.",
    "keyPhrases": []
  },
  {
    "id": "mc-37",
    "start": 187.4,
    "end": 193.4,
    "textEn": "So why not think about something you have always wanted to try and give it a shot!",
    "textVi": "Vậy tại sao không nghĩ về điều gì đó bạn luôn muốn thử và cho nó một cơ hội!",
    "keyPhrases": []
  },
  {
    "id": "mc-38",
    "start": 194,
    "end": 195.3,
    "textEn": "For the next 30 days.",
    "textVi": "Trong 30 ngày tới.",
    "keyPhrases": []
  },
  {
    "id": "mc-39",
    "start": 195.9,
    "end": 197.2,
    "textEn": "Thanks.",
    "textVi": "Cảm ơn các bạn.",
    "keyPhrases": []
  }
],
  },

  // 3. Leonardo DiCaprio: Oscar Acceptance Speech & Climate Action (SpeakNow exact video - 47 sentences)
  {
    id: "video-leonardo-dicaprio",
    slug: "leonardo-dicaprio-oscar-speech",
    youtubeId: "qqIbM1Za5PY",
    title: "Leonardo DiCaprio: Oscar Acceptance Speech & Climate Action",
    description: "Leonardo DiCaprio's historic Oscar win speech for The Revenant, delivering an urgent message on climate change. Full video transcript.",
    topic: "Inspirational",
    level: "A2",
    durationSeconds: 160,
    channelTitle: "Oscars / SpeakNow",
    sentences: [
  {
    "id": "leo-1",
    "start": 3.3,
    "end": 14.3,
    "textEn": "Making the Revenant was about man's relationship to the natural world a world that we collectively felt in 2015.",
    "textVi": "Thực hiện bộ phim The Revenant nói về mối quan hệ giữa con người và thế giới tự nhiên, một thế giới mà tất cả chúng ta đều cảm nhận được vào năm 2015."
  },
  {
    "id": "leo-2",
    "start": 10.6,
    "end": 14.3,
    "textEn": "As the hottest year in recorded.",
    "textVi": "Là năm nóng nhất từng được ghi nhận."
  },
  {
    "id": "leo-3",
    "start": 21.8,
    "end": 33.8,
    "textEn": "History making the Revenant was about man's relationship to the natural world a world that we collectively felt in.",
    "textVi": "Lịch sử, việc thực hiện The Revenant nói về mối quan hệ giữa con người và thế giới tự nhiên, một thế giới mà tất cả chúng ta đã cùng cảm nhận vào."
  },
  {
    "id": "leo-4",
    "start": 29,
    "end": 33.8,
    "textEn": "2015 as the hottest year in recorded.",
    "textVi": "Năm 2015 là năm nóng nhất từng được ghi nhận."
  },
  {
    "id": "leo-5",
    "start": 41.3,
    "end": 51.3,
    "textEn": "History making the Revenant was about man's relationship to the natural world a world that we collectively felt in.",
    "textVi": "Lịch sử, việc thực hiện The Revenant nói về mối quan hệ giữa con người với thế giới tự nhiên, một thế giới mà chúng ta đã cùng cảm nhận vào."
  },
  {
    "id": "leo-6",
    "start": 48.5,
    "end": 54.3,
    "textEn": "2015 as the hottest year in recorded history.",
    "textVi": "Năm 2015 là năm nóng nhất trong lịch sử từng được ghi nhận."
  },
  {
    "id": "leo-7",
    "start": 61.4,
    "end": 67.8,
    "textEn": "Our production needed to move to the southern tip of this planet just to be able to find.",
    "textVi": "Đội ngũ sản xuất của chúng tôi đã phải di chuyển đến tận cực nam của hành tinh này chỉ để có thể tìm thấy."
  },
  {
    "id": "leo-8",
    "start": 71,
    "end": 78.4,
    "textEn": "Snow our production needed to move to the southern tip of this planet just to be able to find.",
    "textVi": "Tuyết, đoàn làm phim của chúng tôi đã phải di chuyển đến tận cực nam của hành tinh này chỉ để có thể tìm thấy."
  },
  {
    "id": "leo-9",
    "start": 81.6,
    "end": 90,
    "textEn": "Snow our production needed to move to the southern tip of this planet just to be able to find snow.",
    "textVi": "Tuyết, đoàn làm phim của chúng tôi đã phải di chuyển đến tận cực nam của hành tinh này chỉ để có thể tìm thấy tuyết."
  },
  {
    "id": "leo-10",
    "start": 93.3,
    "end": 98,
    "textEn": "Climate change is real it is happening right.",
    "textVi": "Biến đổi khí hậu là có thật, nó đang diễn ra ngay."
  },
  {
    "id": "leo-11",
    "start": 99.2,
    "end": 104.9,
    "textEn": "Now climate change is real it is happening right.",
    "textVi": "Lúc này, biến đổi khí hậu là có thật, nó đang xảy ra ngay."
  },
  {
    "id": "leo-12",
    "start": 106.2,
    "end": 111.8,
    "textEn": "Now climate change is real it is happening right.",
    "textVi": "Lúc này, biến đổi khí hậu là có thật và nó đang diễn ra ngay."
  },
  {
    "id": "leo-13",
    "start": 113.6,
    "end": 122.9,
    "textEn": "Now it is the most urgent threat facing our entire species and and we need to.",
    "textVi": "Lúc này, đây là mối đe dọa cấp bách nhất đối với toàn bộ giống loài của chúng ta và chúng ta cần phải."
  },
  {
    "id": "leo-14",
    "start": 120.5,
    "end": 125.9,
    "textEn": "Work collectively together and stop procrastinated.",
    "textVi": "Cùng nhau hành động và ngừng trì hoãn."
  },
  {
    "id": "leo-15",
    "start": 135,
    "end": 148.3,
    "textEn": "Procrastinating it is the most urgent threat facing our entire species and and we need to work collectively together.",
    "textVi": "Sự trì hoãn, đó là mối đe dọa cấp bách nhất đối với toàn bộ giống loài của chúng ta và chúng ta cần phải cùng nhau đoàn kết."
  },
  {
    "id": "leo-16",
    "start": 143.3,
    "end": 148.3,
    "textEn": "And stop procrastinated procrastinating.",
    "textVi": "Và ngừng trì hoãn, chần chừ."
  },
  {
    "id": "leo-17",
    "start": 157.4,
    "end": 165.7,
    "textEn": "It is a most urgent threat facing our entire species and and we need to work.",
    "textVi": "Đó là mối đe dọa cấp bách nhất đối với toàn bộ giống loài của chúng ta và chúng ta cần phải làm việc."
  },
  {
    "id": "leo-18",
    "start": 163.7,
    "end": 168.7,
    "textEn": "Collectively together and stop procrastinated.",
    "textVi": "Cùng nhau và ngừng sự trì hoãn."
  },
  {
    "id": "leo-19",
    "start": 177.4,
    "end": 186.6,
    "textEn": "Procrastinating we need to support leaders around the world who who do not speak for the big polluters of the big.",
    "textVi": "Trì hoãn, chúng ta cần ủng hộ những nhà lãnh đạo trên khắp thế giới, những người không đại diện cho những kẻ gây ô nhiễm lớn, cho các tập đoàn."
  },
  {
    "id": "leo-20",
    "start": 191.4,
    "end": 200.7,
    "textEn": "Corporations and we need to support leaders around the world who who do not speak for the big polluters of the big.",
    "textVi": "Lớn và chúng ta cần ủng hộ các nhà lãnh đạo trên toàn thế giới, những người không lên tiếng thay cho những kẻ gây ô nhiễm lớn, các tập đoàn."
  },
  {
    "id": "leo-21",
    "start": 205.5,
    "end": 214.9,
    "textEn": "Corporations and we need to support leaders around the world who who do not speak for the big polluters of the big.",
    "textVi": "Lớn, và chúng ta cần hỗ trợ các nhà lãnh đạo trên toàn thế giới, những người không đại diện cho những kẻ gây ô nhiễm lớn thuộc các tập đoàn."
  },
  {
    "id": "leo-22",
    "start": 219.9,
    "end": 228.6,
    "textEn": "Corporations but who speak for all of humanity for the indigenous people of the world for the billions and billions.",
    "textVi": "Lớn, mà là những người lên tiếng cho toàn thể nhân loại, cho các thổ dân trên thế giới, cho hàng tỷ và hàng tỷ."
  },
  {
    "id": "leo-23",
    "start": 226.8,
    "end": 231.6,
    "textEn": "Of underprivileged people who will be most affected by.",
    "textVi": "Người kém may mắn, những người sẽ phải chịu ảnh hưởng nặng nề nhất bởi."
  },
  {
    "id": "leo-24",
    "start": 238.4,
    "end": 247.3,
    "textEn": "This but who speak for all of humanity for the indigenous people of the world for the billions and billions of.",
    "textVi": "Điều này, mà là những người lên tiếng vì toàn thể nhân loại, vì các cộng đồng bản địa trên thế giới, vì hàng tỷ và hàng tỷ."
  },
  {
    "id": "leo-25",
    "start": 245.5,
    "end": 250.1,
    "textEn": "Underprivileged people who will be most affected by.",
    "textVi": "Con người kém may mắn, những đối tượng sẽ gánh chịu hậu quả nặng nề nhất từ."
  },
  {
    "id": "leo-26",
    "start": 256.9,
    "end": 265.8,
    "textEn": "This but who speak for all of humanity for the indigenous people of the world for the billions and billions of.",
    "textVi": "Điều này, mà là những người nói thay cho toàn nhân loại, cho các dân tộc bản địa trên thế giới, cho hàng tỷ và hàng tỷ người."
  },
  {
    "id": "leo-27",
    "start": 264,
    "end": 269.6,
    "textEn": "Underprivileged people who will be most affected by this.",
    "textVi": "Kém may mắn, những người sẽ phải chịu ảnh hưởng nặng nề nhất bởi điều này."
  },
  {
    "id": "leo-28",
    "start": 276.6,
    "end": 284.7,
    "textEn": "For our children's children and for those people out there whose voices have been drowned out by the politics of.",
    "textVi": "Vì con cháu của chúng ta và vì những con người ngoài kia, những người có tiếng nói đã bị bóp nghẹt bởi nền chính trị."
  },
  {
    "id": "leo-29",
    "start": 290.2,
    "end": 300.3,
    "textEn": "Greed for our children's children and for those people out there whose voices have been drowned out by the politics of.",
    "textVi": "Ích kỷ, vì con cháu của chúng ta và vì những con người ngoài kia, những người có tiếng nói đã bị lấn át bởi nền chính trị."
  },
  {
    "id": "leo-30",
    "start": 297.3,
    "end": 300.3,
    "textEn": "Greed.",
    "textVi": "Tham lam."
  },
  {
    "id": "leo-31",
    "start": 305.8,
    "end": 313.9,
    "textEn": "For our children's children and for those people out there whose voices have been drowned out by the politics of.",
    "textVi": "Vì thế hệ mai sau của chúng ta và vì những con người ngoài kia, những người có tiếng nói đã bị bóp nghẹt bởi chính trị."
  },
  {
    "id": "leo-32",
    "start": 319,
    "end": 331.3,
    "textEn": "Greed I thank you all for this amazing award tonight let us not take this planet for granted I do not take tonight.",
    "textVi": "Lòng tham. Tôi cảm ơn tất cả mọi người vì giải thưởng tuyệt vời này tối nay, chúng ta đừng xem hành tinh này là điều hiển nhiên, tôi không xem buổi tối hôm nay."
  },
  {
    "id": "leo-33",
    "start": 326.8,
    "end": 331.3,
    "textEn": "For granted thank you so very much.",
    "textVi": "Là điều hiển nhiên, cảm ơn mọi người rất nhiều."
  },
  {
    "id": "leo-34",
    "start": 339.1,
    "end": 346.2,
    "textEn": "I thank you all for this amazing award tonight let us not take this planet for.",
    "textVi": "Tôi cảm ơn tất cả các bạn vì giải thưởng tuyệt vời tối nay, xin đừng xem hành tinh này là điều hiển nhiên."
  },
  {
    "id": "leo-35",
    "start": 343.7,
    "end": 351.2,
    "textEn": "Granted I do not take tonight for granted thank you so very [Applause].",
    "textVi": "Là điều hiển nhiên, tôi không coi vinh dự đêm nay là điều hiển nhiên, cảm ơn rất nhiều [Vỗ tay]."
  },
  {
    "id": "leo-36",
    "start": 357.2,
    "end": 367,
    "textEn": "Much I thank you all for this amazing award tonight let us not take this planet for granted I do not take tonight.",
    "textVi": "Nhiều. Tôi xin cảm ơn tất cả các bạn vì giải thưởng tuyệt vời đêm nay, chúng ta đừng xem hành tinh này là điều hiển nhiên, tôi không xem đêm nay."
  },
  {
    "id": "leo-37",
    "start": 365,
    "end": 370.3,
    "textEn": "For granted thank you so very [Applause].",
    "textVi": "Là điều hiển nhiên, cảm ơn rất nhiều [Vỗ tay]."
  },
  {
    "id": "leo-38",
    "start": 378.6,
    "end": 389,
    "textEn": "Much making the Revenant was about man's relationship to the natural world a world that we collectively felt in 2015.",
    "textVi": "Thực hiện bộ phim The Revenant là nói về mối quan hệ giữa con người và thế giới tự nhiên, một thế giới mà tất cả chúng ta đã cùng cảm nhận vào năm 2015."
  },
  {
    "id": "leo-39",
    "start": 386.9,
    "end": 396,
    "textEn": "As the hottest year in recorded history our production needed to move to the southern tip of this planet just to be.",
    "textVi": "Là năm nóng nhất trong lịch sử được ghi nhận, đoàn làm phim của chúng tôi đã phải di chuyển đến tận cực nam của hành tinh này chỉ để."
  },
  {
    "id": "leo-40",
    "start": 392.8,
    "end": 403.4,
    "textEn": "Able to find snow climate change is real it is happening right now it is the most.",
    "textVi": "Có thể tìm thấy tuyết. Biến đổi khí hậu là có thật, nó đang diễn ra ngay lúc này, đây là điều."
  },
  {
    "id": "leo-41",
    "start": 399.2,
    "end": 410,
    "textEn": "Urgent threat facing our entire species and and we need to work collectively together and stop procrastinated.",
    "textVi": "Cấp bách nhất đe dọa toàn bộ giống loài của chúng ta và chúng ta cần phải cùng nhau đoàn kết hành động và ngừng trì hoãn."
  },
  {
    "id": "leo-42",
    "start": 407.8,
    "end": 417.3,
    "textEn": "Procrastinating we need to support leaders around the world who who do not speak for the big polluters of the big.",
    "textVi": "Sự trì hoãn, chúng ta cần ủng hộ những nhà lãnh đạo trên toàn thế giới, những người không đại diện cho những kẻ gây ô nhiễm lớn, cho các tập đoàn."
  },
  {
    "id": "leo-43",
    "start": 414.8,
    "end": 423.1,
    "textEn": "Corporations but who speak for all of humanity for the indigenous people of the world world for the billions and.",
    "textVi": "Lớn, mà thay vào đó là những người lên tiếng cho toàn nhân loại, cho các thổ dân trên thế giới, cho hàng tỷ và."
  },
  {
    "id": "leo-44",
    "start": 421.2,
    "end": 430,
    "textEn": "Billions of underprivileged people who will be most affected by this for our children's children and for those people.",
    "textVi": "Hàng tỷ người kém may mắn sẽ chịu ảnh hưởng nhiều nhất bởi điều này, vì con cháu chúng ta và vì những con người."
  },
  {
    "id": "leo-45",
    "start": 428.2,
    "end": 435.4,
    "textEn": "Out there whose voices have been drowned out by the politics of greed I thank you.",
    "textVi": "Ngoài kia, những ai có tiếng nói đã bị bóp nghẹt bởi nền chính trị lòng tham, tôi xin cảm ơn."
  },
  {
    "id": "leo-46",
    "start": 432.8,
    "end": 440,
    "textEn": "All for this amazing award tonight let us not take this planet for granted I do.",
    "textVi": "Tất cả các bạn vì giải thưởng tuyệt vời tối nay, xin đừng xem hành tinh này là điều hiển nhiên, tôi."
  },
  {
    "id": "leo-47",
    "start": 438.1,
    "end": 443.5,
    "textEn": "Not take tonight for granted thank you so very much.",
    "textVi": "Không xem vinh dự đêm nay là điều hiển nhiên, cảm ơn các bạn rất nhiều."
  }
],
  },

  // 4. Steve Jobs: Stanford Commencement Address (Opening + Connecting the Dots + Love What You Do)
  {
    id: "video-steve-jobs",
    slug: "steve-jobs-love-what-you-do",
    youtubeId: "UF8uR6Z6KLc",
    title: "Steve Jobs: How to Find What You Love & Connect the Dots",
    description: "Famous speech excerpt by Steve Jobs at Stanford University about passion, curiosity, and trusting your journey.",
    topic: "Inspirational",
    level: "B1",
    durationSeconds: 904,
    channelTitle: "Stanford Commencement",
    sentences: [
      {
        id: "sj-intro-1",
        start: 26.1,
        end: 34.0,
        textEn: "I am honored to be with you today for your commencement from one of the finest universities in the world.",
        textVi: "Tôi rất vinh dự được có mặt cùng các bạn hôm nay tại buổi lễ tốt nghiệp của một trong những trường đại học xuất sắc nhất thế giới.",
        note: "'commencement' = lễ trao bằng tốt nghiệp đại học.",
        keyPhrases: [
          { phrase: "I am honored to", meaningVi: "Tôi rất vinh dự được..." },
          { phrase: "commencement", meaningVi: "lễ trao bằng tốt nghiệp" }
        ]
      },
      {
        id: "sj-intro-2",
        start: 35.0,
        end: 46.5,
        textEn: "Truth be told, I never graduated from college, and this is the closest I've ever gotten to a college graduation.",
        textVi: "Thú thật là, tôi chưa từng tốt nghiệp đại học, và đây là lần tôi ở gần một buổi lễ tốt nghiệp đại học nhất từ trước đến nay.",
        note: "'Truth be told' = thành thật mà nói.",
        keyPhrases: [
          { phrase: "Truth be told", meaningVi: "Thành thật mà nói" },
          { phrase: "closest I've ever gotten to", meaningVi: "lần gần nhất tôi từng chạm tới" }
        ]
      },
      {
        id: "sj-intro-3",
        start: 46.5,
        end: 56.5,
        textEn: "Today, I want to tell you three stories from my life. That's it. No big deal. Just three stories.",
        textVi: "Hôm nay, tôi muốn kể cho các bạn nghe ba câu chuyện từ cuộc đời tôi. Chỉ có vậy thôi. Chẳng có gì to tát cả. Chỉ là ba câu chuyện.",
        note: "'No big deal' = không có gì to tát.",
        keyPhrases: [
          { phrase: "three stories from my life", meaningVi: "ba câu chuyện trong đời tôi" },
          { phrase: "No big deal", meaningVi: "Không có gì to tát cả" }
        ]
      },
      {
        id: "sj-intro-4",
        start: 56.5,
        end: 64.5,
        textEn: "The first story is about connecting the dots. I dropped out of Reed College after the first six months.",
        textVi: "Câu chuyện đầu tiên là về việc kết nối các điểm mốc. Tôi đã bỏ học tại Cao đẳng Reed sau 6 tháng đầu tiên.",
        note: "'drop out of' = bỏ học giữa chừng.",
        keyPhrases: [
          { phrase: "connecting the dots", meaningVi: "kết nối các mắt xích / điểm mốc" },
          { phrase: "dropped out of", meaningVi: "bỏ học giữa chừng" }
        ]
      },
      {
        id: "sj-1",
        start: 307.0,
        end: 313.2,
        textEn: "Again, you can't connect the dots looking forward; you can only connect them looking backwards.",
        textVi: "Một lần nữa, bạn không thể kết nối các điểm mốc khi nhìn về phía trước; bạn chỉ có thể kết nối chúng khi nhìn lại quá khứ.",
        keyPhrases: [
          { phrase: "connect the dots", meaningVi: "kết nối các sự kiện/kinh nghiệm trong đời" },
          { phrase: "looking forward", meaningVi: "nhìn về tương lai" },
          { phrase: "looking backwards", meaningVi: "nhìn lại quá khứ" }
        ]
      },
      {
        id: "sj-2",
        start: 313.2,
        end: 317.3,
        textEn: "So you have to trust that the dots will somehow connect in your future.",
        textVi: "Vì vậy bạn phải tin tưởng rằng các điểm mốc đó bằng cách nào đó sẽ kết nối với nhau trong tương lai.",
        keyPhrases: [
          { phrase: "trust that", meaningVi: "tin tưởng rằng" },
          { phrase: "somehow", meaningVi: "bằng cách nào đó" }
        ]
      },
      {
        id: "sj-3",
        start: 317.3,
        end: 322.8,
        textEn: "You have to trust in something: your gut, destiny, life, karma, whatever.",
        textVi: "Bạn phải tin vào một điều gì đó: trực giác của bạn, số phận, cuộc sống, nhân quả, bất cứ thứ gì.",
        keyPhrases: [
          { phrase: "your gut", meaningVi: "trực giác / linh tính của bạn" },
          { phrase: "trust in something", meaningVi: "đặt niềm tin vào điều gì" }
        ]
      },
      {
        id: "sj-4",
        start: 322.8,
        end: 327.8,
        textEn: "Because believing that the dots will connect down the road will give you the confidence to follow your heart.",
        textVi: "Bởi vì việc tin rằng những điểm mốc sẽ kết nối sau này sẽ cho bạn sự tự tin để đi theo trái tim mình.",
        keyPhrases: [
          { phrase: "down the road", meaningVi: "về sau / trong tương lai" },
          { phrase: "follow your heart", meaningVi: "lắng nghe và đi theo trái tim" }
        ]
      },
      {
        id: "sj-5",
        start: 327.8,
        end: 336.0,
        textEn: "Even when it leads you off the well-worn path, and that will make all the difference.",
        textVi: "Ngay cả khi nó dẫn bạn rời xa con đường mòn quen thuộc, và điều đó sẽ tạo nên toàn bộ sự khác biệt.",
        keyPhrases: [
          { phrase: "well-worn path", meaningVi: "lối mòn quen thuộc" },
          { phrase: "make all the difference", meaningVi: "tạo nên sự khác biệt lớn" }
        ]
      },
      {
        id: "sj-6",
        start: 505.7,
        end: 514.7,
        textEn: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
        textVi: "Công việc sẽ chiếm một phần lớn cuộc đời bạn, và cách duy nhất để thực sự thỏa mãn là làm những gì bạn tin là công việc vĩ đại.",
        keyPhrases: [
          { phrase: "fill a large part of", meaningVi: "chiếm phần lớn" },
          { phrase: "truly satisfied", meaningVi: "thực sự thỏa mãn / hài lòng" }
        ]
      },
      {
        id: "sj-7",
        start: 514.7,
        end: 520.0,
        textEn: "And the only way to do great work is to love what you do.",
        textVi: "Và cách duy nhất để làm nên công việc vĩ đại là hãy yêu điều bạn làm.",
        keyPhrases: [
          { phrase: "love what you do", meaningVi: "yêu việc mình làm" }
        ]
      },
      {
        id: "sj-8",
        start: 520.0,
        end: 526.0,
        textEn: "If you haven't found it yet, keep looking. Don't settle.",
        textVi: "Nếu bạn vẫn chưa tìm thấy nó, hãy tiếp tục tìm kiếm. Đừng dừng lại chấp nhận an phận.",
        keyPhrases: [
          { phrase: "keep looking", meaningVi: "tiếp tục tìm kiếm" },
          { phrase: "don't settle", meaningVi: "đừng an phận / đừng bỏ cuộc" }
        ]
      }
    ]
  }
];
