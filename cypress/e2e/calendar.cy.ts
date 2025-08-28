describe('반복 일정 E2E 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('사용자가 반복 유형을 매일로 설정한다', () => {
    it('2025-08-25 09:00에 시작하는 일정에서 2025-08-30까지 매일 반복 설정 시 해당 기간 동안 매일 이벤트가 생성된다', () => {
      cy.get('#title').type('양꼬치 먹는 날');
      cy.get('#date').type('2025-08-25');
      cy.get('#start-time').type('09:00');
      cy.get('#end-time').type('10:00');
      cy.get('#description').type('양꼬치 맛있겠다');
      cy.get('#location').type('합정역');
      cy.get('#category').click();
      cy.get('[aria-label="개인-option"]').click();

      cy.contains('반복 일정').click();
      cy.get('[data-testid="repeat-type-select"]').click();
      cy.get('[data-testid="repeat-end-date-input"]').type('2025-08-30');
      cy.get('[data-testid="event-submit-button"]').click();

      // 일정 겹침 경고 모달이 나타나면 계속 진행 버튼 클릭
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="overlap-continue-button"]').length > 0) {
          cy.get('[data-testid="overlap-continue-button"]').click();
        }
      });

      cy.contains('일정이 추가되었습니다.').should('be.visible');

      cy.get('[data-testid="event-list"]').should('contain', '양꼬치 먹는 날');
      ['25', '26', '27', '28', '29', '30'].forEach((date) => {
        cy.get('[data-testid="month-view"]')
          .contains(date)
          .parent()
          .should('contain', '양꼬치 먹는 날');
      });

      // 반복 진행 아이콘 여부 확인
      cy.get('[data-testid="month-view"]').find('[data-testid="repeat-icon"]').should('exist');
      cy.get('[data-testid="month-view"]')
        .find('svg[data-testid="repeat-icon"]')
        .should('have.length.at.least', 6);
    });
  });
});
