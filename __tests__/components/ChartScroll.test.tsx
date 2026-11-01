/**
 * A lesson chart wider than its card (a phone) says it scrolls: the far
 * edge fades and a hint sits under the card. A chart that fits says nothing.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ChartScroll } from '@/components/lesson/ChartScroll';

/** jsdom lays nothing out, so give the card the widths a phone would */
function widths(scrollWidth: number, clientWidth: number) {
  const s = jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth);
  const c = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth);
  return () => {
    s.mockRestore();
    c.mockRestore();
  };
}

const chart = (mini?: boolean) => (
  <ChartScroll label="Every building was full of talent" mini={mini}>
    <table>
      <tbody>
        <tr>
          <td>Aaron Douglas</td>
          <td>painting murals in geometric shapes and bold silhouettes</td>
        </tr>
      </tbody>
    </table>
  </ChartScroll>
);

describe('ChartScroll', () => {
  it('on a phone, where the table overflows, fades the far edge and says to scroll', () => {
    const restore = widths(648, 358);
    render(chart());
    const card = screen.getByRole('region', { name: 'Every building was full of talent' });
    const wrap = card.parentElement!.parentElement!;
    expect(screen.getByText(/Scroll/)).toHaveTextContent('Scroll →');
    expect(wrap).toHaveAttribute('data-more-right');
    expect(wrap).not.toHaveAttribute('data-more-left');
    // scrolled to the end: the hint turns round, the near edge fades instead
    jest.spyOn(card, 'scrollLeft', 'get').mockReturnValue(290);
    act(() => {
      fireEvent.scroll(card);
    });
    expect(screen.getByText(/Scroll back/)).toBeInTheDocument();
    expect(wrap).toHaveAttribute('data-more-left');
    expect(wrap).not.toHaveAttribute('data-more-right');
    restore();
  });

  it('on a wide screen, where the table fits, shows no hint', () => {
    const restore = widths(1167, 1167);
    render(chart());
    expect(screen.queryByText(/Scroll/)).not.toBeInTheDocument();
    restore();
  });

  it('in the presenter’s thumbnail, shows no hint', () => {
    const restore = widths(648, 358);
    render(chart(true));
    expect(screen.queryByText(/Scroll/)).not.toBeInTheDocument();
    restore();
  });
});
