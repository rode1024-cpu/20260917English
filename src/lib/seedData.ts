import { createInitialSm2State } from './sm2'
import { todayKey } from './date'
import type { WordCard } from '../types/card'

interface SeedWord {
  word: string
  meaning: string
  exampleSentence: string
  exampleTranslation: string
}

const SEED_WORDS: SeedWord[] = [
  { word: 'achieve', meaning: '성취하다, 이루다', exampleSentence: 'She worked hard to achieve her goals.', exampleTranslation: '그녀는 목표를 이루기 위해 열심히 노력했다.' },
  { word: 'benefit', meaning: '혜택, 이득', exampleSentence: 'Regular exercise has many health benefits.', exampleTranslation: '규칙적인 운동은 건강에 많은 혜택이 있다.' },
  { word: 'consider', meaning: '고려하다', exampleSentence: 'Please consider all the options before deciding.', exampleTranslation: '결정하기 전에 모든 선택지를 고려해 주세요.' },
  { word: 'develop', meaning: '개발하다, 발전시키다', exampleSentence: 'The company plans to develop a new product.', exampleTranslation: '그 회사는 신제품을 개발할 계획이다.' },
  { word: 'efficient', meaning: '효율적인', exampleSentence: 'This new method is more efficient than the old one.', exampleTranslation: '이 새로운 방법이 예전 방법보다 더 효율적이다.' },
  { word: 'flexible', meaning: '유연한', exampleSentence: 'My work schedule is quite flexible.', exampleTranslation: '내 근무 일정은 꽤 유연하다.' },
  { word: 'genuine', meaning: '진짜의, 진실한', exampleSentence: 'He gave a genuine apology for his mistake.', exampleTranslation: '그는 자신의 실수에 대해 진심 어린 사과를 했다.' },
  { word: 'habit', meaning: '습관', exampleSentence: 'Reading before bed is a good habit.', exampleTranslation: '자기 전에 독서하는 것은 좋은 습관이다.' },
  { word: 'improve', meaning: '개선하다, 향상시키다', exampleSentence: 'I want to improve my English speaking skills.', exampleTranslation: '나는 영어 말하기 실력을 향상시키고 싶다.' },
  { word: 'justify', meaning: '정당화하다', exampleSentence: 'It is hard to justify such a high price.', exampleTranslation: '그렇게 높은 가격을 정당화하기는 어렵다.' },
  { word: 'knowledge', meaning: '지식', exampleSentence: 'She has extensive knowledge of history.', exampleTranslation: '그녀는 역사에 대한 폭넓은 지식을 가지고 있다.' },
  { word: 'legitimate', meaning: '합법적인, 정당한', exampleSentence: 'He has a legitimate reason to be late.', exampleTranslation: '그는 늦은 것에 대한 정당한 이유가 있다.' },
  { word: 'maintain', meaning: '유지하다', exampleSentence: 'It is important to maintain a healthy diet.', exampleTranslation: '건강한 식단을 유지하는 것이 중요하다.' },
  { word: 'negotiate', meaning: '협상하다', exampleSentence: 'They negotiated a better price for the car.', exampleTranslation: '그들은 그 차의 더 나은 가격을 협상했다.' },
  { word: 'obvious', meaning: '명백한', exampleSentence: 'It was obvious that he was upset.', exampleTranslation: '그가 화가 났다는 것은 명백했다.' },
  { word: 'particular', meaning: '특정한, 특별한', exampleSentence: 'Is there a particular reason you chose this?', exampleTranslation: '당신이 이것을 선택한 특별한 이유가 있나요?' },
  { word: 'qualify', meaning: '자격을 얻다', exampleSentence: 'You need a degree to qualify for this job.', exampleTranslation: '이 직업에 자격을 얻으려면 학위가 필요하다.' },
  { word: 'reliable', meaning: '믿을 수 있는', exampleSentence: 'He is a reliable friend who always helps.', exampleTranslation: '그는 항상 도와주는 믿을 수 있는 친구다.' },
  { word: 'significant', meaning: '중요한, 상당한', exampleSentence: 'There has been a significant increase in sales.', exampleTranslation: '매출에 상당한 증가가 있었다.' },
  { word: 'tolerate', meaning: '참다, 용인하다', exampleSentence: 'I cannot tolerate such rude behavior.', exampleTranslation: '나는 그런 무례한 행동을 참을 수 없다.' },
  { word: 'urgent', meaning: '긴급한', exampleSentence: 'This is an urgent matter that needs attention.', exampleTranslation: '이것은 관심이 필요한 긴급한 사안이다.' },
  { word: 'valuable', meaning: '귀중한, 가치 있는', exampleSentence: 'Time is a valuable resource.', exampleTranslation: '시간은 귀중한 자원이다.' },
  { word: 'wealthy', meaning: '부유한', exampleSentence: 'She comes from a wealthy family.', exampleTranslation: '그녀는 부유한 가정 출신이다.' },
  { word: 'accomplish', meaning: '완수하다, 해내다', exampleSentence: 'We accomplished the project ahead of schedule.', exampleTranslation: '우리는 일정보다 앞서 프로젝트를 완수했다.' },
  { word: 'boundary', meaning: '경계, 한계', exampleSentence: 'It is healthy to set boundaries at work.', exampleTranslation: '직장에서 경계를 설정하는 것은 건강한 일이다.' },
  { word: 'circumstance', meaning: '상황, 환경', exampleSentence: 'Under normal circumstances, he would agree.', exampleTranslation: '일반적인 상황이라면 그는 동의할 것이다.' },
  { word: 'diverse', meaning: '다양한', exampleSentence: 'The city has a diverse population.', exampleTranslation: '그 도시는 다양한 인구를 가지고 있다.' },
  { word: 'evaluate', meaning: '평가하다', exampleSentence: 'Teachers evaluate students based on their tests.', exampleTranslation: '교사들은 시험을 바탕으로 학생들을 평가한다.' },
  { word: 'frequent', meaning: '빈번한', exampleSentence: 'There have been frequent power outages lately.', exampleTranslation: '최근에 빈번한 정전이 있었다.' },
  { word: 'generous', meaning: '관대한, 후한', exampleSentence: 'He is generous with his time and money.', exampleTranslation: '그는 시간과 돈에 대해 관대하다.' },
  { word: 'hesitate', meaning: '망설이다', exampleSentence: 'Do not hesitate to ask if you need help.', exampleTranslation: '도움이 필요하면 망설이지 말고 물어보세요.' },
  { word: 'identify', meaning: '식별하다, 확인하다', exampleSentence: 'The police identified the suspect quickly.', exampleTranslation: '경찰은 용의자를 빠르게 식별했다.' },
  { word: 'inevitable', meaning: '불가피한', exampleSentence: 'Change is inevitable in every business.', exampleTranslation: '모든 사업에서 변화는 불가피하다.' },
  { word: 'inspire', meaning: '영감을 주다', exampleSentence: 'Her story inspired many young students.', exampleTranslation: '그녀의 이야기는 많은 젊은 학생들에게 영감을 주었다.' },
  { word: 'invest', meaning: '투자하다', exampleSentence: 'It is wise to invest in your own skills.', exampleTranslation: '자신의 역량에 투자하는 것은 현명하다.' },
  { word: 'isolate', meaning: '고립시키다', exampleSentence: 'The village was isolated by the heavy snow.', exampleTranslation: '그 마을은 폭설로 고립되었다.' },
  { word: 'launch', meaning: '출시하다, 시작하다', exampleSentence: 'The company will launch a new app next week.', exampleTranslation: '그 회사는 다음 주에 새로운 앱을 출시할 것이다.' },
  { word: 'literally', meaning: '문자 그대로, 정말로', exampleSentence: 'I was literally the last person to leave.', exampleTranslation: '나는 정말로 마지막으로 떠난 사람이었다.' },
  { word: 'manipulate', meaning: '조작하다', exampleSentence: 'He tried to manipulate the data to look better.', exampleTranslation: '그는 데이터를 더 좋아 보이게 조작하려고 했다.' },
  { word: 'mutual', meaning: '상호간의', exampleSentence: 'They have mutual respect for each other.', exampleTranslation: '그들은 서로에 대한 상호 존중을 가지고 있다.' },
  { word: 'notable', meaning: '주목할 만한', exampleSentence: 'There was a notable improvement in her grades.', exampleTranslation: '그녀의 성적에 주목할 만한 향상이 있었다.' },
  { word: 'objective', meaning: '목표, 객관적인', exampleSentence: 'Our main objective is to increase customer satisfaction.', exampleTranslation: '우리의 주요 목표는 고객 만족도를 높이는 것이다.' },
  { word: 'overcome', meaning: '극복하다', exampleSentence: 'She overcame many obstacles to succeed.', exampleTranslation: '그녀는 성공하기 위해 많은 장애물을 극복했다.' },
  { word: 'persuade', meaning: '설득하다', exampleSentence: 'It took time to persuade him to join the team.', exampleTranslation: '그를 팀에 합류하도록 설득하는 데 시간이 걸렸다.' },
  { word: 'postpone', meaning: '연기하다, 미루다', exampleSentence: 'We had to postpone the meeting until next week.', exampleTranslation: '우리는 회의를 다음 주로 연기해야 했다.' },
  { word: 'priority', meaning: '우선순위', exampleSentence: 'Safety is our top priority.', exampleTranslation: '안전이 우리의 최우선 순위다.' },
  { word: 'reluctant', meaning: '꺼리는, 마지못한', exampleSentence: 'He was reluctant to share his opinion.', exampleTranslation: '그는 자신의 의견을 나누기를 꺼렸다.' },
  { word: 'sufficient', meaning: '충분한', exampleSentence: 'We do not have sufficient evidence yet.', exampleTranslation: '우리는 아직 충분한 증거를 가지고 있지 않다.' },
  { word: 'thorough', meaning: '철저한', exampleSentence: 'The inspector did a thorough check of the building.', exampleTranslation: '조사관은 건물을 철저하게 점검했다.' },
  { word: 'vulnerable', meaning: '취약한', exampleSentence: 'Elderly people can be vulnerable to scams.', exampleTranslation: '노인들은 사기에 취약할 수 있다.' },
]

/** 앱 최초 실행 시 로컬 저장소가 비어 있을 때 채워 넣을 기본 단어 카드 50개 */
export function createSeedCards(): WordCard[] {
  const today = todayKey()
  return SEED_WORDS.map((seed, index) => ({
    id: `seed-${String(index + 1).padStart(3, '0')}`,
    ...seed,
    ...createInitialSm2State(today),
    createdAt: today,
  }))
}
