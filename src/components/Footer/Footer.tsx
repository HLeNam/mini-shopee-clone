const REGION_LIST = [
  'Singapore',
  'Indonesia',
  'Thái Lan',
  'Malaysia',
  'Việt Nam',
  'Philippines',
  'Brazil',
  'México',
  'Colombia',
  'Chile',
  'Đài Loan'
];

import image from '~/assets/images';

const Footer = () => {
  return (
    <footer className='bg-neutral-100 py-16 text-sm text-neutral-600'>
      <div className='Container'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>© 2025 Shopee. Tất cả các quyền được bảo lưu.</div>
          </div>
          <div className='lg:col-span-2'>
            <div>
              Quốc gia & Khu vực:{' '}
              {REGION_LIST.map((region, index) => (
                <span
                  key={index}
                  className={`mr-2 inline-block ${index < REGION_LIST.length - 1 ? 'border-r border-neutral-300 pr-2' : ''}`}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='mt-10 text-center text-sm text-neutral-600'>
          <div className='text-orange mb-4 flex items-center justify-center gap-2 font-semibold'>
            <img
              className='block !h-11'
              style={{ width: 'auto', height: '2.75rem' }}
              src={image.daDangKy}
              alt='Đã đăng ký'
            />
            <img
              className='block !h-11'
              style={{ width: 'auto', height: '2.75rem' }}
              src={image.daDangKy}
              alt='Đã đăng ký'
            />
            <img
              className='block !h-11'
              style={{ width: 'auto', height: '2.75rem' }}
              src={image.chinhHang}
              alt='Chính hãng'
            />
          </div>
          <div>Công ty TNHH Shopee</div>
          <div className='mt-6'>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành
            phố Hà Nội, Việt Nam. Chăm sóc khách hàng: Gọi tổng đài Shopee (miễn phí) hoặc Trò chuyện với Shopee ngay
            trên Trung tâm trợ giúp
          </div>
          <div className='mt-2'>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Bùi Anh Tuấn</div>
          <div className='mt-2'>
            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015
          </div>
          <div className='mt-2'>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
