import { signal } from '@angular/core';
import { Player } from '@omegajump-core/entities/players';
import { ExportedPlayer } from '../models';

export class UiDataUtils {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly exportedPlayers = signal<ExportedPlayer[]>([]);

  public static exportPlayer(player: Player): void {
    const exportedPlayer = UiDataUtils.getExportedPlayer(player);
    if (exportedPlayer) {
      if (exportedPlayer.energy() !== player.energy) {
        exportedPlayer.energy.set(player.energy);
      }
      if (exportedPlayer.powerCellCombo() !== player.powerCellCombo.combo) {
        exportedPlayer.powerCellCombo.set(player.powerCellCombo.combo);
      }
      const powerCellComboExpiration = player.powerCellCombo.expiration;
      if (exportedPlayer.powerCellComboExpiration() !== powerCellComboExpiration) {
        exportedPlayer.powerCellComboExpiration.set(powerCellComboExpiration);
      }
    } else {
      UiDataUtils.exportedPlayers.update(players => [
        ...players,
        {
          color: signal(player.color),
          energy: signal(player.energy),
          powerCellCombo: signal(player.powerCellCombo.combo),
          powerCellComboExpiration: signal(player.powerCellCombo.expiration)
        }
      ]);
    }
  }

  private static getExportedPlayer(player: Player): ExportedPlayer | undefined {
    return UiDataUtils.exportedPlayers().find(exportedPlayer => exportedPlayer.color() === player.color);
  }
}
