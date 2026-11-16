import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import { useRemoteData } from '../hooks/useRemoteData.js';
import { mockNews, mockEvents } from '../data/mockData.js';
export default function Home() {
  const news = useRemoteData('/news', mockNews);
  const events = useRemoteData('/events', mockEvents);
  return (<>
    <Hero />
    <Section title="სიახლეები" items={news.data} loading={news.loading} kind="news" />
    <Section title="ღონისძიებები" items={events.data} loading={events.loading} kind="event" />
  </>);
}
