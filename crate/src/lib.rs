use wasm_bindgen::prelude::*;

const SIZE: usize = 32;

fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[derive(Debug, Clone)]
struct Bitboard {
    pub width: usize,
    pub height: usize,
    pub data: Vec<u32>,
}

impl Bitboard {
    fn new(width: usize, height: usize) -> Self {
        let size = (width as f32 * height as f32 / SIZE as f32).ceil() as usize;

        Bitboard {
            width,
            height,
            data: vec![0; size],
        }
    }

    fn set(&mut self, x: isize, y: isize, value: bool) -> Result<(), &'static str> {
        if x < 0 || x >= self.width as isize || y < 0 || y >= self.height as isize {
            return Err("Index out of range.");
        }

        let index = y as usize * self.width + x as usize;
        let i = index / SIZE;
        let j = index % SIZE;

        self.data[i] = if value {
            self.data[i] | (1 << j)
        } else {
            self.data[i] & !(1 << j)
        };

        Ok(())
    }

    fn get(&self, x: isize, y: isize) -> Option<bool> {
        if x < 0 || x >= self.width as isize || y < 0 || y >= self.height as isize {
            return None;
        }

        let index = y as usize * self.width + x as usize;
        let i = index / SIZE;
        let j = index % SIZE;

        let tmp = self.data[i];

        Some((tmp & (1 << j)) != 0)
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    height: usize,
    board: Bitboard,
    back_buffer: Bitboard,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, height: usize) -> Self {
        set_panic_hook();

        World {
            width,
            height,
            board: Bitboard::new(width, height),
            back_buffer: Bitboard::new(width, height),
        }
    }

    pub fn contents(&self) -> *const u32 {
        self.board.data.as_ptr()
    }

    fn total_neighbors(&self, x: isize, y: isize) -> u8 {
        let mut total = 0;

        if let Some(true) = self.board.get(x, y - 1) {
            total += 1;
        }
        if let Some(true) = self.board.get(x + 1, y - 1) {
            total += 1;
        }
        if let Some(true) = self.board.get(x + 1, y) {
            total += 1;
        }
        if let Some(true) = self.board.get(x + 1, y + 1) {
            total += 1;
        }
        if let Some(true) = self.board.get(x, y + 1) {
            total += 1;
        }
        if let Some(true) = self.board.get(x - 1, y + 1) {
            total += 1;
        }
        if let Some(true) = self.board.get(x - 1, y) {
            total += 1;
        }
        if let Some(true) = self.board.get(x - 1, y - 1) {
            total += 1;
        }

        total
    }

    pub fn simulate(&mut self) {
        for y in 0..self.width {
            for x in 0..self.height {
                let x = x as isize;
                let y = y as isize;

                let total_neighbors = self.total_neighbors(x, y);

                if let Some(state) = self.board.get(x, y) {
                    match state {
                        true => {
                            let survives = match total_neighbors {
                                0 | 1 => false,
                                2 | 3 => true,
                                4.. => false,
                            };

                            self.back_buffer
                                .set(x, y, survives)
                                .expect("The coordinates should always be within the bounds.");
                        }
                        false => {
                            let revives = total_neighbors == 3;

                            self.back_buffer
                                .set(x, y, revives)
                                .expect("The coordinates should always be within the bounds.");
                        }
                    }
                }
            }
        }

        self.board
            .data
            .as_mut_slice()
            .copy_from_slice(self.back_buffer.data.as_slice());
    }

    pub fn get(&self, x: isize, y: isize) -> bool {
        self.board.get(x, y).unwrap_or(false)
    }

    pub fn set(&mut self, x: isize, y: isize, value: bool) {
        let _ = self.board.set(x, y, value);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bitboard() -> Result<(), &'static str> {
        let mut board = Bitboard::new(24, 32);

        assert_eq!(board.data.len(), 24);

        board.set(5, 28, true)?;
        board.set(5, 28, true)?;

        assert_eq!(board.get(5, 28), Some(true));

        board.set(3, 2, true)?;
        board.set(3, 2, false)?;

        assert_eq!(board.get(3, 2), Some(false));

        assert!(board.set(500, 0, true).is_err());

        Ok(())
    }
}
