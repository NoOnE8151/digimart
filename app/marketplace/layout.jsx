import Header from '@/components/header';
import Link from 'next/link';

const MarketplaceLayout = ({ children, params }) => {
  // params.category will be available if your route is like /marketplace/[category]
  const currentCategory = params?.category || 'all';

  const categories = [
    { name: 'All', slug: 'all', path: '/marketplace' },
    { name: 'Design', slug: 'design', path: '/marketplace/design' },
    { name: 'E-book', slug: 'ebook', path: '/marketplace/ebook' },
    { name: 'Music', slug: 'music', path: '/marketplace/music' },
    { name: 'Videos', slug: 'videos', path: '/marketplace/videos' },
    { name: 'Other', slug: 'other', path: '/marketplace/other' },
  ];

  return (
    <div className='flex flex-col gap-5 px-5 py-3'>
      <Header />
      <main className='px-10'>
        <nav className='px-5'>
          <ul className='flex items-center list-none gap-5 md:text-lg text-muted-foreground'>
            {categories.map((cat) => (
              <li key={cat.name} >
                <Link
                  href={cat.path}
                  className={`cursor-pointer hover:text-foreground ${
                    currentCategory.toLowerCase() === cat.slug ? 'text-foreground font-semibold' : ''
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <hr className='my-3' />
        {children}
      </main>
    </div>
  );
};

export default MarketplaceLayout;
