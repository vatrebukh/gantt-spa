import { getNavHtml } from '../frontend/static/js/home-service';

const rootMock = '<body><div id="root"></div></body>';

describe('homeService', () => {
    beforeEach(() => {
      document.body.innerHTML = rootMock;
    });
  
    test('should render navbar', () => {
        document.getElementById('root').innerHTML = getNavHtml();
  
        const navbar = document.querySelector('nav');
        expect(navbar).toBeTruthy();

        const hrefList = navbar.querySelectorAll('li');
        expect(hrefList).toBeTruthy();
        expect(hrefList).toHaveLength(3);
  
    });
});